import pygame


class Wire:
    def __init__(self, start, end, tension=1.0):
        self.start = start
        self.end = end
        self.tension = tension

    def draw(self, surface):
        pygame.draw.line(surface, (120, 200, 255), self.start, self.end, 3)
