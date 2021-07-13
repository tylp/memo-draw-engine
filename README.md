# ⚙️ Memo draw engine ⚙️

Drawing engine for [MemoDraw](https://github.com/tylp/memo-draw)


## State of the art

Before juping into the development of the drawing engine, we asked ourselves what technologies were used for similar needs.

|                | Network traffic | Latency | Fluidity | Ease of implementation |
|----------------|:-----------------:|:---------:|:----------:|:------------------------:|
| **[Demo socket io](#demo-socket-io)**|  🔴             |     🟢    |    🟢      |                 🟢       |
| **[Gartic phone](#gartic-phone)**|    🟢             |    🟠     |      🔴    |         🟠               |
| **[Awwap](#awwap)**|         🟠        |   🟠        |     🔴     |        🟠                 |
| **[Figma](#figma-figjam)**|       🔴          |     🟢      |    🟠      |                   🔴     |
| **[Skribbl](#skribbl)**|       🟠          |     🟠     |  🟢        |               🟠         |

The network traffic was calculated with the network analyzer of firefox by repeating the same drawing (thanks to https://github.com/eguller/MouseRecorder) on each site.

### Demo socket io

- **Drawing** : Classic canvas
- **Event** : Emitted on MouseDown && (MouseUp || MouseMove)
- **Network traffic** (Smile draw - 10s) : 433 messages - 50.77 KB
- **WS message format** : Line with 4 points (x1; y1; x2; y2) + color - for each line

### Gartic phone

- **Drawing** : Triple canvas (draw, pointer, logo)
- **Event** : Emitted on MouseUp
- **Network traffic** (Smile draw - 10s) : 6 messages - 8 KB
- **WS message format** : List of point (x, y), first point contain color - for each section

### Awwap

- **Drawing** : Triple canvas (draw, pointer, logo)
- **Event** : Emitted on MouseUp
- **Network traffic** (Smile draw - 10s) : 120 messages - 20 kb
- **WS message format** : List of point (x, y), color, size, opacity, uid, type + ack ? - for each section 


### Figma (FigJam)

- **Drawing** : Canvas with GPU optimization (WebGL ?)
- **Event** : Emitted on MouseDown && (MouseUp || MouseMove) - use of delay ? 
- **Network traffic** (Smile draw - 10s) : 900 messages - 2 MB
- **WS message format** : encrypted

### Skribbl

- **Drawing** : Classic canvas 
- **Event** : Emitted on MouseDown && MouseMove - use of delay ? 
- **Network traffic** (Smile draw - 10s) : 185 messages - 30 kb
- **WS message format** : Type, id, ist of point ( 2 coord (x1; y1; x2; y2) + angle ? - (variable number of point - number a point during a certain delay ?) 
