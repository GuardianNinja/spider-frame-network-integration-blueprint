# Spider Frame Network Integration Blueprint

This repository defines a reference blueprint for FAAO-style identity and routing:

- Multi-scale identity: `G` (Global), `N` (National), `L` (Local)
- State-scoped identity: `FL`, `CA`, `TX`, etc.
- Domain separation: `GO` (Ground), `AO` (Air), `SO` (Space)
- Facility and mission routing: `MCO-TRACON`, `VBG-LAUNCHWINDOW`, `CCC-SFN`
- Local Spider Frame Network (SFN) sandbox access for secure private projects.

Identity format:

`[SCALE]-[STATE]-[FULLNAME]-[DOMAIN]-[FACILITY]-[MISSION]`

Example:

- `G-FL-LEIFWILLIAMSOGGE-AO-MCO-TRACON`
- `N-CA-JANEDOE-SO-VBG-LAUNCHWINDOW`
- `L-FL-LEIFWILLIAMSOGGE-SO-CCC-SFN`

Run the demo:

```bash
npm install
npm run start
