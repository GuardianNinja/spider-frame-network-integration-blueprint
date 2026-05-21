class GalaxyEditorScreen:
    def __init__(self, screen):
        self.screen = screen
        self.net = GalaxyNet()
        self.next_id = 1
        self.selected = None
        self.launch_node = None  # NEW

    def handle_click(self, pos):
        # select or connect
        for node in self.net.nodes.values():
            if distance(node.position, pos) < 12:
                if self.selected and self.selected != node:
                    self.net.connect(self.selected.id, node.id)
                    self.selected = None
                else:
                    self.selected = node
                    self.launch_node = node  # NEW: selecting a node marks it for launch
                return

        # otherwise create node
        node_id = f"N{self.next_id}"
        self.next_id += 1
        self.net.add_node(node_id, f"Node {node_id}", pos)
