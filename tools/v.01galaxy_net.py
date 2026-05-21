import json

class GalaxyNode:
    def __init__(self, node_id, name, position):
        self.id = node_id
        self.name = name
        self.position = position
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

    def load(self, path):
        with open(path, "r") as f:
            data = json.load(f)

        self.nodes = {}
        for nd in data["nodes"]:
            node = self.add_node(nd["id"], nd["name"], tuple(nd["position"]))
            node.tags = nd.get("tags", [])
            node.connections = set(nd.get("connections", []))
