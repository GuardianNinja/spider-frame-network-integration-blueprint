import pygame
from engine.spider import SpiderFrame
from engine.wire import Wire
from engine.companion import Companion
from engine.mercy import MercyEngine
from engine.world import World
from engine.bike import MorphBike
from engine.galaxy_editor_screen import GalaxyEditorScreen

WIDTH, HEIGHT = 1280, 720

MODE_SPIDER = "spider"
MODE_BIKE = "bike"
MODE_EDITOR = "editor"
MODE_MENU = "menu"


class SpiderGame:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Spider Frame — Prototype")
        self.clock = pygame.time.Clock()
        self.running = True

        self.mode = MODE_MENU

        # core play state
        self.world = World()
        self.spider = SpiderFrame()
        self.companion = Companion(personality="guardian")
        self.mercy = MercyEngine()
        self.bike = MorphBike()

        # simple test wire
        self.main_wire = Wire((100, 360), (1180, 360), tension=1.0)
        self.world.add_wire(self.main_wire)

        # editor
        self.editor = GalaxyEditorScreen(self.screen)

        # HUD state
        self.hud_hint = ""
        self.player_state = "calm"

    def handle_input_play(self):
        keys = pygame.key.get_pressed()
        dx = (keys[pygame.K_d] - keys[pygame.K_a])
        dy = (keys[pygame.K_s] - keys[pygame.K_w])

        # mode toggle
        if keys[pygame.K_TAB]:
            self.mode = MODE_BIKE if self.mode == MODE_SPIDER else MODE_SPIDER

        # attach / sling
        if self.mode == MODE_SPIDER:
            if keys[pygame.K_SPACE]:
                if not self.spider.attached:
                    self.spider.try_attach(self.world.wires)
                else:
                    self.spider.sling()
            self.spider.move(dx * 0.5, dy * 0.5)
        elif self.mode == MODE_BIKE:
            self.bike.update_dir = (dx, dy)

        # companion call (placeholder)
        if keys[pygame.K_q]:
            self.hud_hint = self.companion.advise(self.player_state) or ""

    def handle_input_menu(self, events):
        keys = pygame.key.get_pressed()
        for event in events:
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_RETURN:
                    # default: go to play
                    self.mode = MODE_SPIDER
                elif event.key == pygame.K_g:
                    self.mode = MODE_EDITOR
                elif event.key == pygame.K_ESCAPE:
                    self.running = False

    def handle_input_editor(self, events):
        for event in events:
            if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                self.editor.handle_click(event.pos)
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.mode = MODE_MENU

    def update_play(self, dt):
        if self.mode == MODE_SPIDER:
            self.spider.update(dt)
        elif self.mode == MODE_BIKE:
            self.bike.update(dt, getattr(self.bike, "update_dir", (0, 0)))
        self.companion.update(self.spider, self.world)

        # simple player state mock
        self.player_state = "calm"
        if self.spider.attached:
            self.hud_hint = "Hold SPACE to sling"
        else:
            self.hud_hint = "Press SPACE near a wire to attach"

    def draw_play(self):
        self.screen.fill((5, 5, 20))
        self.world.draw(self.screen)

        if self.mode == MODE_SPIDER:
            self.spider.draw(self.screen)
        else:
            self.bike.draw(self.screen)

        self.companion.draw(self.screen)
        self.draw_hud()
        pygame.display.flip()

    def draw_menu(self):
        self.screen.fill((5, 5, 20))
        font = pygame.font.SysFont(None, 48)
        small = pygame.font.SysFont(None, 24)

        title = font.render("SPIDER FRAME", True, (220, 240, 255))
        self.screen.blit(title, (WIDTH // 2 - title.get_width() // 2, 180))

        play = small.render("> PLAY  [ENTER]", True, (200, 220, 255))
        galaxy = small.render("  GALAXY NET  [G]", True, (150, 180, 220))
        exit_t = small.render("  EXIT  [ESC]", True, (150, 180, 220))

        self.screen.blit(play, (WIDTH // 2 - 120, 280))
        self.screen.blit(galaxy, (WIDTH // 2 - 120, 310))
        self.screen.blit(exit_t, (WIDTH // 2 - 120, 340))

        footer = small.render("[W][A][S][D] MOVE  |  [ENTER] SELECT  |  [ESC] BACK", True, (120, 140, 180))
        self.screen.blit(footer, (WIDTH // 2 - footer.get_width() // 2, HEIGHT - 40))

        pygame.display.flip()

    def draw_editor(self):
        self.editor.draw()
        pygame.display.flip()

    def draw_hud(self):
        font = pygame.font.SysFont(None, 24)

        # top-left: node name (placeholder)
        node = font.render("NODE: Test Node", True, (180, 200, 230))
        self.screen.blit(node, (20, 20))

        # top-center: wire tension bar (placeholder)
        bar_x = WIDTH // 2 - 100
        bar_y = 20
        pygame.draw.rect(self.screen, (40, 60, 90), (bar_x, bar_y, 200, 12), border_radius=4)
        tension = 0.5
        color = (80, 180, 255) if tension < 0.7 else (255, 190, 80)
        pygame.draw.rect(self.screen, color, (bar_x, bar_y, int(200 * tension), 12), border_radius=4)

        # bottom-left: companion status
        comp_text = font.render(f"COMPANION: {self.companion.personality_key.upper()}", True, (200, 220, 255))
        self.screen.blit(comp_text, (20, HEIGHT - 60))

        # bottom-right: hint
        hint = font.render(self.hud_hint, True, (180, 200, 230))
        self.screen.blit(hint, (WIDTH - hint.get_width() - 20, HEIGHT - 40))

    def run(self):
        while self.running:
            dt = self.clock.tick(60) / 1000
            events = pygame.event.get()
            for event in events:
                if event.type == pygame.QUIT:
                    self.running = False

            if self.mode == MODE_MENU:
                self.handle_input_menu(events)
                self.draw_menu()
            elif self.mode in (MODE_SPIDER, MODE_BIKE):
                self.handle_input_play()
                self.update_play(dt)
                self.draw_play()
            elif self.mode == MODE_EDITOR:
                self.handle_input_editor(events)
                self.draw_editor()

        pygame.quit()


if __name__ == "__main__":
    SpiderGame().run()
