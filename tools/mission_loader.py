# mission_loader.py

from engine.wire import Wire
from engine.world import World

class Mission:
    def __init__(self, name, world, start_pos):
        self.name = name
        self.world = world
        self.start_pos = start_pos


def mission_from_node(node, net):
    world = World()

    # simple rule: every connection becomes a wire
    for cid in node.connections:
        other = net.nodes[cid]
        world.add_wire(Wire(node.position, other.position, tension=1.0))

    # spawn at node position
    start_pos = node.position

    return Mission(node.name, world, start_pos)
