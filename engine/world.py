class World:
    def __init__(self):
        self.wires = []

    def add_wire(self, wire):
        self.wires.append(wire)

    def draw(self, surface):
        for w in self.wires:
            w.draw(surface)
