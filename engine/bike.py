import pygame


class MorphBike:
    MODE_TRACK = "track"
    MODE_FREE = "free"

    def __init__(self):
        self.x, self.y = 400, 360
        self.vx, self.vy = 0, 0
        self.mode = self.MODE_TRACK
        self.track_nodes = []
        self.update_dir = (0, 0)

    def toggle_mode(self):
        self.mode = self.MODE_FREE if self.mode == self.MODE_TRACK else self.MODE_TRACK

    def update(self, dt, input_dir):
        ax, ay = input_dir
        speed = 400 if self.mode == self.MODE_FREE else 250
        self.vx += ax * speed * dt
        self.vy += ay * speed * dt

        self.x += self.vx * dt
        self.y += self.vy * dt

        self.vx *= 0.92
        self.vy *= 0.92

        if self.mode == self.MODE_TRACK:
            self.track_nodes.append((self.x, self.y))
            if len(self.track_nodes) > 80:
                self.track_nodes.pop(0)

    def get_track_segments(self):
        return list(zip(self.track_nodes, self.track_nodes[1:]))

    def draw(self, surface):
        color = (180, 255, 180) if self.mode == self.MODE_TRACK else (255, 160, 160)
        pygame.draw.rect(surface, color, (self.x - 10, self.y - 5, 20, 10))
        for a, b in self.get_track_segments():
            pygame.draw.line(surface, (120, 255, 180), a, b, 2)
