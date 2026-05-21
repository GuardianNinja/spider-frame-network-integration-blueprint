import pygame
import math


class SpiderFrame:
    def __init__(self):
        self.x, self.y = 200, 360
        self.vx, self.vy = 0, 0
        self.attached = None

    def move(self, dx, dy):
        # free movement when not attached
        if not self.attached:
            self.vx += dx
            self.vy += dy

    def try_attach(self, wires, max_dist=40):
        closest = None
        closest_d = max_dist
        for w in wires:
            d = self._distance_to_segment(w.start, w.end)
            if d < closest_d:
                closest_d = d
                closest = w
        if closest:
            self.attached = closest
            # snap to nearest point on wire
            px, py = self._closest_point_on_segment(closest.start, closest.end)
            self.x, self.y = px, py
            self.vx, self.vy = 0, 0

    def sling(self):
        if not self.attached:
            return
        sx, sy = self.attached.start
        ex, ey = self.attached.end
        dx = ex - sx
        dy = ey - sy
        length = max(math.hypot(dx, dy), 1)
        nx, ny = dx / length, dy / length
        # simple impulse along wire direction
        impulse = 600
        self.vx += nx * impulse
        self.vy += ny * impulse
        self.attached = None

    def update(self, dt):
        if not self.attached:
            self.x += self.vx * dt
            self.y += self.vy * dt
            self.vx *= 0.9
            self.vy *= 0.9
        else:
            # stay on wire
            px, py = self._closest_point_on_segment(self.attached.start, self.attached.end)
            self.x, self.y = px, py

    def draw(self, surface):
        pygame.draw.circle(surface, (180, 240, 255), (int(self.x), int(self.y)), 12)
        if self.attached:
            pygame.draw.circle(surface, (120, 200, 255), (int(self.x), int(self.y)), 16, 1)

    def _closest_point_on_segment(self, a, b):
        ax, ay = a
        bx, by = b
        px, py = self.x, self.y
        abx, aby = bx - ax, by - ay
        ab_len2 = abx * abx + aby * aby
        if ab_len2 == 0:
            return a
        t = ((px - ax) * abx + (py - ay) * aby) / ab_len2
        t = max(0, min(1, t))
        return ax + abx * t, ay + aby * t

    def _distance_to_segment(self, a, b):
        px, py = self._closest_point_on_segment(a, b)
        return math.hypot(self.x - px, self.y - py)
