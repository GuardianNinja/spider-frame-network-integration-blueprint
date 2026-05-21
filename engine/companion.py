import pygame
import random

PERSONALITY_PROFILES = {
    "guardian": {
        "follow_distance": 80,
        "intervene_threshold": 0.6,
        "voice": "steady",
        "follow_speed": 0.06,
    },
    "scout": {
        "follow_distance": 140,
        "intervene_threshold": 0.3,
        "voice": "chirpy",
        "follow_speed": 0.12,
    },
    "coach": {
        "follow_distance": 100,
        "intervene_threshold": 0.8,
        "voice": "encouraging",
        "follow_speed": 0.08,
    },
}


class Companion:
    def __init__(self, personality="guardian"):
        self.personality_key = personality
        self.profile = PERSONALITY_PROFILES[personality]
        self.x, self.y = 260, 320

    def update(self, spider, world):
        dx = spider.x - self.x
        dy = spider.y - self.y
        self.x += dx * self.profile["follow_speed"]
        self.y += dy * self.profile["follow_speed"]

    def advise(self, player_state):
        if self.personality_key == "coach" and player_state == "struggling":
            return random.choice(["Try a gentler angle.", "You’ve got this—shorter jumps."])
        if self.personality_key == "scout" and player_state == "lost":
            return "I marked a safe wire ahead."
        if self.personality_key == "guardian" and player_state == "overwhelmed":
            return "Shielding route—take the calmer path."
        return None

    def draw(self, surface):
        pygame.draw.circle(surface, (255, 210, 120), (int(self.x), int(self.y)), 8)
