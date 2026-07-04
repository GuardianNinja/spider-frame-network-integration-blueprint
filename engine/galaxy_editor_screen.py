import math
import pygame
from engine.galaxy_net import GalaxyNet


def distance(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


class GalaxyEditorScreen:
    def __init__(self, screen):
        self.screen = screen
        self.net = GalaxyNet()
        self.next_id = 1
        self.selected = None
        self.launch_node = None

    def handle_click(self, pos):
        # select or connect existing node
        for node in self.net.nodes.values():
            if distance(node.position, pos) < 12:
                if self.selected and self.selected != node:
                    self.net.connect(self.selected.id, node.id)
                    self.selected = None
                else:
                    self.selected = node
                    self.launch_node = node
                return

        # otherwise create a new node at click position
        node_id = f"N{self.next_id}"
        self.next_id += 1
        self.net.add_node(node_id, f"Node {node_id}", pos)

    def draw(self):
        self.screen.fill((5, 5, 20))
        font = pygame.font.SysFont(None, 20)

        # draw edges
        for node in self.net.nodes.values():
            for cid in node.connections:
                if cid in self.net.nodes:
                    other = self.net.nodes[cid]
                    pygame.draw.line(
                        self.screen,
                        (60, 100, 160),
                        node.position,
                        other.position,
                        1,
                    )

        # draw nodes
        for node in self.net.nodes.values():
            color = (100, 200, 255) if node != self.selected else (255, 220, 80)
            pygame.draw.circle(self.screen, color, node.position, 10)
            label = font.render(node.name, True, (180, 200, 230))
            self.screen.blit(label, (node.position[0] + 13, node.position[1] - 8))

        # instructions
        hint = font.render(
            "Click to create node | Click two nodes to connect | ESC = back",
            True,
            (120, 140, 180),
        )
        self.screen.blit(hint, (20, self.screen.get_height() - 30))
