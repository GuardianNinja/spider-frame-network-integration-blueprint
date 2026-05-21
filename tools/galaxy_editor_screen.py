import pygame
import math
from tools.galaxy_net import GalaxyNet


def distance(a, b):
    ax, ay = a
    bx, by = b
    return math.hypot(ax - bx, ay - by)


class GalaxyEditorScreen:
    def __init__(self, screen):
        self.screen = screen
        self.net = GalaxyNet()
        self.next_id = 1
        self.selected = None

    def handle_click(self, pos):
        # select or connect
        for node in self.net.nodes.values():
            if distance(node.position, pos) < 12:
                if self.selected and self.selected != node:
                    self.net.connect(self.selected.id, node.id)
                    self.selected = None
                else:
                    self.selected = node
                return

        # otherwise create node
        node_id = f"N{self.next_id}"
        self.next_id += 1
        self.net.add_node(node_id, f"Node {node_id}", pos)

    def draw(self):
        self.screen.fill((0, 0, 20))

        # draw connections
        for node in self.net.nodes.values():
            for cid in node.connections:
                other = self.net.nodes[cid]
                pygame.draw.line(self.screen, (80, 120, 200), node.position, other.position, 1)

        # draw nodes
        for node in self.net.nodes.values():
            color = (200, 240, 255)
            if self.selected == node:
                color = (255, 220, 140)
            pygame.draw.circle(self.screen, color, node.position, 8)
