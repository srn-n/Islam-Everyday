# Islam Everyday - the 3D prayer figure (Nov 2026).
# Builds the two characters (man, woman) for How to pray from the MakeHuman base mesh, shape targets, skeleton and skin
# weights that ship as data with MPFB2 (https://github.com/makehumancommunity/mpfb2, src/mpfb/data; assets are CC0).
# Only the data files are read; none of the plugin's code is run.
#   python3 tools/prayer-figure/build.py <path to mpfb2/src/mpfb/data> <output folder>
# Output: man.bin, woman.bin (see FORMAT at the end) for assets/salah-3d.js, and <who>.npz with the same data for the
# Blender source scene (tools/prayer-figure/make_blend.py).
# Coordinates written: x = forward (the way the person faces), y = up, z = the person's right; metres; feet on y = 0.
import json, gzip, sys, os, struct
import numpy as np
D, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

def load_obj():
    V, F, FG, g = [], [], [], None
    for ln in open(D + '/3dobjs/base.obj'):
        if ln.startswith('v '): V.append([float(x) for x in ln.split()[1:4]])
        elif ln.startswith('g '): g = ln.split()[1]
        elif ln.startswith('f '): F.append([int(x.split('/')[0]) - 1 for x in ln.split()[1:]]); FG.append(g)
    return np.array(V), np.array(F), np.array(FG)
V0, F, FG = load_obj()
VG = json.load(open(D + '/mesh_metadata/basemesh_vertex_groups.json'))
gi = lambda n: np.concatenate([np.arange(a, b + 1) for a, b in VG[n]])
RIG = json.load(open(D + '/rigs/standard/rig.game_engine.json'))
WTS = json.load(open(D + '/rigs/standard/weights.game_engine.json'))['weights']
BONES = []
def order(n):
    if n in BONES: return
    if RIG[n]['parent']: order(RIG[n]['parent'])
    BONES.append(n)
for n in RIG: order(n)
BI = {n: i for i, n in enumerate(BONES)}

def target(V, name, w=1.0):
    with gzip.open(D + '/targets/' + name + '.target.gz', 'rt') as f:
        for ln in f:
            p = ln.split()
            if len(p) == 4 and not ln.startswith('#'): V[int(p[0])] += w * np.array([float(p[1]), float(p[2]), float(p[3])])

def vnormals(V, tris):
    n = np.zeros_like(V); fn = np.cross(V[tris[:, 1]] - V[tris[:, 0]], V[tris[:, 2]] - V[tris[:, 0]])
    for k in range(3): np.add.at(n, tris[:, k], fn)
    l = np.linalg.norm(n, axis=1, keepdims=True); l[l == 0] = 1; return n / l

def build(who):
    V = V0.copy(); g = 'female' if who == 'woman' else 'male'
    target(V, f'macrodetails/universal-{g}-young-averagemuscle-averageweight')
    for r in ('caucasian', 'asian', 'african'): target(V, f'macrodetails/{r}-{g}-young', 1 / 3)
    nv = len(V)
    # skin weights, dense
    Wd = np.zeros((nv, len(BONES)), np.float32)
    for b, lst in WTS.items():
        for vi, w in lst: Wd[vi, BI[b]] = w
    dom = Wd.argmax(1); domn = np.array(BONES)[dom]
    J = lambda n: V[gi(n)].mean(0)
    def bpos(spec):
        if spec['strategy'] == 'CUBE': return J(spec['cube_name'])
        return V[spec['vertex_indices']].mean(0)
    heads = np.array([bpos(RIG[b]['head']) for b in BONES]); tails = np.array([bpos(RIG[b]['tail']) for b in BONES])
    ground = J('joint-ground')[1]
    quadn = vnormals(V, np.concatenate([F[:, [0, 1, 2]], F[:, [0, 2, 3]]]))
    side = lambda b: b[-2:]
    isb = lambda names: np.isin(domn, names)
    fing = [b for b in BONES if b.split('_')[0] in ('thumb', 'index', 'middle', 'ring', 'pinky')]
    parts = []   # (name, face mask, inflate (dm), colour, vertex tweak)
    body = FG == 'body'
    SNAP = {}
    fa = lambda mask: mask[F].all(1)          # faces whose corners all satisfy a vertex mask
    fany = lambda mask: mask[F].any(1)
    y, x, z = V[:, 1], V[:, 0], V[:, 2]
    wristL, wristR = J('joint-l-hand'), J('joint-r-hand'); ankL, ankR = J('joint-l-ankle'), J('joint-r-ankle')
    near = lambda p, r: np.linalg.norm(V - p, axis=1) < r
    hands = isb(fing + ['hand_l', 'hand_r']) | ((near(wristL, 0.75) | near(wristR, 0.75)) & isb(['lowerarm_l', 'lowerarm_r']))
    feet = isb(['foot_l', 'foot_r', 'ball_l', 'ball_r']) | ((near(ankL, 1.0) | near(ankR, 1.0)) & isb(['calf_l', 'calf_r']))
    neckJ = J('joint-neck'); headv = isb(['head', 'neck_01']) | (y > neckJ[1] - 0.55)
    SKIN = (0.80, 0.60, 0.46) if who == 'man' else (0.84, 0.64, 0.50)
    eyeL, eyeR, mouth = J('joint-l-eye'), J('joint-r-eye'), J('joint-mouth')
    if who == 'man':
        parts.append(('skin', body & fa(headv | hands | feet), 0, SKIN))
        tights = FG == 'helper-tights'
        upper = ~isb(['thigh_l', 'thigh_r', 'calf_l', 'calf_r', 'foot_l', 'foot_r', 'ball_l', 'ball_r']) & ~hands
        parts.append(('kurta', tights & fa(upper | (y > J('joint-l-upper-leg')[1] - 1.6)) & ~fany(near(wristL, 0.35) | near(wristR, 0.35)), 0.16, (0.93, 0.92, 0.88)))
        kneeY = J('joint-l-knee')[1]
        parts.append(('kurta', (FG == 'helper-skirt') & fa(y > kneeY - 0.9), 0.22, (0.93, 0.92, 0.88)))
        legs = isb(['thigh_l', 'thigh_r', 'calf_l', 'calf_r', 'pelvis'])
        parts.append(('trousers', tights & fa(legs & (y < J('joint-l-upper-leg')[1] - 0.5)) & ~fany(near(ankL, 0.55) | near(ankR, 0.55)), 0.1, (0.36, 0.42, 0.45)))
        hair = FG == 'helper-hair'
        back = z < J('joint-head')[2] + 0.42      # the helper is a long-hair shape: keep only what lies behind the temples
        hz = J('joint-head')[2]
        hair_y = lambda vv: eyeL[1] + 0.55 + 1.3 * np.clip((vv[:, 2] - hz - 0.45) / 0.9, -1, 0)
        cap_y = lambda vv: eyeL[1] + 0.74 + 0.12 * np.clip((vv[:, 2] - hz) / 1.0, -1, 1)
        # faces that cross the hairline are kept and their lower corners lifted onto it (SNAP), so the edge is a clean line
        SNAP.update(hair=hair_y, cap=cap_y)
        parts.append(('hair', body & fa(isb(['head'])) & fany(y > hair_y(V)), 0.045, (0.13, 0.10, 0.08)))
        parts.append(('cap', body & fa(isb(['head'])) & fany(y > cap_y(V)), 0.12, (0.96, 0.96, 0.94)))
    else:
        # the face that shows inside the scarf: an oval on the front of the head
        oval = (((x / 0.66) ** 2 + ((y - (eyeL[1] - 0.22)) / 1.02) ** 2) < 1) & (z > eyeL[2] - 0.95)
        parts.append(('skin', body & fa(oval | hands | feet), 0, SKIN))
        scarfc = (0.33, 0.42, 0.52)
        parts.append(('scarf', body & fa(headv) & ~fa(oval), 0.13, scarfc))
        tights = FG == 'helper-tights'
        HEM = neckJ[1] - 2.1; cape = (y > HEM)
        parts.append(('scarf', tights & fa(cape) & ~fany(hands), 0.34, scarfc))
        
        upper = ~isb(['thigh_l', 'thigh_r', 'calf_l', 'calf_r', 'foot_l', 'foot_r', 'ball_l', 'ball_r']) & ~hands
        dress = (0.90, 0.84, 0.80)
        parts.append(('dress', tights & fa(upper | (y > J('joint-l-upper-leg')[1] - 1.6)) & ~fany(near(wristL, 0.35) | near(wristR, 0.35)), 0.2, dress))
        parts.append(('dress', FG == 'helper-skirt', 0.25, dress))
    for e in ('helper-l-eye', 'helper-r-eye'): parts.append(('eye', FG == e, 0, (0.95, 0.95, 0.93)))
    P, N, C, BIx, BW, IDX, PART = [], [], [], [], [], [], []
    base = 0; names = []
    for name, fm, infl, col in parts:
        fs = F[fm]
        if not len(fs): print('  empty part', name); continue
        used = np.unique(fs); remap = -np.ones(nv, int); remap[used] = np.arange(len(used))
        p = V[used] + quadn[used] * infl
        if name in SNAP: p[:, 1] = np.maximum(p[:, 1], SNAP[name](V[used]))
        if name == 'scarf' and infl == 0.34: p[:, 1] = np.maximum(p[:, 1], HEM - 0.02)      # a clean hem for the cape
        if name == 'dress' and infl == 0.25:      # a loose A-line: wider towards the hem
            top = p[:, 1].max(); t = np.clip((top - p[:, 1]) / (top - p[:, 1].min()), 0, 1)
            p[:, 0] *= 1 + 0.16 * t; p[:, 2] = (p[:, 2] - 0.1) * (1 + 0.16 * t) + 0.1
        c = np.tile(np.array(col, np.float32), (len(used), 1))
        if name == 'skin':
            vv = V[used]
            for e in (eyeL, eyeR):   # eyebrows: a dark band above each eye
                m = (np.abs(vv[:, 0] - e[0]) < 0.30) & (vv[:, 1] > e[1] + 0.20) & (vv[:, 1] < e[1] + 0.28) & (vv[:, 2] > e[2] - 0.25)
                c[m] = np.array(col) * 0.5
            m = (np.abs(vv[:, 0]) < 0.26) & (np.abs(vv[:, 1] - mouth[1] + 0.02) < 0.085) & (vv[:, 2] > mouth[2] + 0.05)   # lips
            c[m] = np.array(col) * np.array([0.86, 0.66, 0.66])
        if name == 'eye':
            vv = V[used]; zf = vv[:, 2].max(); ctr = vv.mean(0); r = np.hypot(vv[:, 0] - ctr[0], vv[:, 1] - ctr[1])
            c[(vv[:, 2] > zf - 0.07) & (r < 0.075)] = (0.20, 0.13, 0.08)
        tris = np.concatenate([fs[:, [0, 1, 2]], fs[:, [0, 2, 3]]]); tris = remap[tris]
        w = Wd[used].copy(); top4 = np.argsort(-w, 1)[:, :4]; w4 = np.take_along_axis(w, top4, 1); w4 /= np.maximum(w4.sum(1, keepdims=True), 1e-6)
        P.append(p); N.append(vnormals(p, tris)); C.append(c); BIx.append(top4); BW.append(w4); IDX.append(tris + base); PART += [name] * len(used); base += len(used)
        names.append(name)
    P, N, C, BIx, BW, IDX = map(np.concatenate, (P, N, C, BIx, BW, IDX))
    skinmask = (np.array(PART) == 'skin').astype('u1')
    # to app coordinates: forward = obj z, up = obj y, right = -obj x; decimetres -> metres; ground at 0
    conv = lambda a, off=True: np.stack([a[:, 2], a[:, 1] - (ground if off else 0), -a[:, 0]], 1) * 0.1
    P, N, heads, tails = conv(P), conv(N, False) * 10, conv(heads), conv(tails)
    # marks used by the player (rest pose, app coordinates)
    mk = lambda v: [round(float(t), 4) for t in conv(np.array([v]))[0]]
    hv = V[gi('body')]; top = hv[hv[:, 1].argmax()]
    front = lambda jn: V[gi(jn)].mean(0)
    marks = {'forehead': mk([0, eyeL[1] + 0.55, V[(np.abs(x) < 0.1) & (np.abs(y - eyeL[1] - 0.55) < 0.1) & (FGv := np.arange(nv) < 13380)][:, 2].max()]),
             'nose': mk([0, eyeL[1] - 0.42, V[(np.abs(x) < 0.08) & (np.abs(y - eyeL[1] + 0.42) < 0.12) & (np.arange(nv) < 13380)][:, 2].max()]),
             'headTop': mk(top), 'headC': mk(J('joint-head-2') if 'joint-head-2' in VG else J('joint-head'))}
    meta = {'who': who, 'nv': int(len(P)), 'ni': int(IDX.size), 'bones': [{'n': b, 'p': BI[RIG[b]['parent']] if RIG[b]['parent'] else -1, 'h': [round(float(t), 5) for t in heads[i]], 't': [round(float(t), 5) for t in tails[i]]} for i, b in enumerate(BONES)],
            'marks': marks, 'nskin': int(skinmask.sum()), 'height': round(float(P[:, 1].max()), 4)}
    lo = P.min(0); sc = (P.max(0) - lo).max() / 65535.0
    meta['lo'] = [float(t) for t in lo]; meta['sc'] = float(sc)
    q = np.round((P - lo) / sc).astype('<u2'); q = np.concatenate([q, np.zeros((len(q), 1), '<u2')], 1)
    nq = np.concatenate([np.clip(np.round(N * 127), -127, 127).astype('i1'), np.zeros((len(N), 1), 'i1')], 1)
    cq = np.concatenate([np.round(C * 255).astype('u1'), np.full((len(C), 1), 255, 'u1')], 1)
    wq = np.round(BW * 255).astype('u1'); wq[:, 0] += (255 - wq.sum(1)).astype('u1')
    js = json.dumps(meta, separators=(',', ':')).encode(); js += b' ' * (-len(js) % 4)
    with open(f'{OUT}/{who}.bin', 'wb') as f:
        f.write(struct.pack('<4sI', b'IEF1', len(js))); f.write(js)
        for a in (q, nq, cq, BIx.astype('u1'), wq, IDX.astype('<u4'), skinmask): f.write(a.tobytes())
    np.savez_compressed(f'{OUT}/{who}.npz', P=P, N=N, C=C, BI=BIx, BW=BW, IDX=IDX, heads=heads, tails=tails, bones=np.array(BONES), parents=np.array([m['p'] for m in meta['bones']]), part=np.array(PART))
    print(who, 'verts', len(P), 'tris', len(IDX), 'height', meta['height'], 'bytes', os.path.getsize(f'{OUT}/{who}.bin'), names, marks)
# FORMAT: "IEF1", u32 json length, json (bones: name, parent, head, tail; lo, sc), then per vertex u16x4 position
# ((p - lo) / sc), i8x4 normal, u8x4 colour, u8x4 bone indices, u8x4 weights, then u32 triangle indices, then one u8 per vertex (1 = bare skin: face, hands, feet).
for who in ('man', 'woman'): build(who)
