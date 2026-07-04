import json


class GalaxyNode:
    def __init__(self, node_id, name, position):
        self.id = node_id
        self.name = name
        self.position = position  # (x, y)
        self.tags = []
        self.connections = set()

    def connect(self, other_id):
        self.connections.add(other_id)


class GalaxyNet:
    def __init__(self):
        self.nodes = {}

    def add_node(self, node_id, name, position):
        node = GalaxyNode(node_id, name, position)
        self.nodes[node_id] = node
        return node

    def connect(self, a_id, b_id):
        self.nodes[a_id].connect(b_id)
        self.nodes[b_id].connect(a_id)

    def to_dict(self):
        return {
            "nodes": [
                {
                    "id": n.id,
                    "name": n.name,
                    "position": n.position,
                    "tags": n.tags,
                    "connections": list(n.connections),
                }
                for n in self.nodes.values()
            ]
        }

    def save(self, path):
        with open(path, "w") as f:
            json.dump(self.to_dict(), f, indent=2)
