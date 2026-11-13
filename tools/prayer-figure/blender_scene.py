# Builds the editable Blender scene of the prayer figure from the app's own files.
#   1. node tools/prayer-figure/export-poses.mjs
#   2. in Blender (Scripting): exec(open(r"<repo>/tools/prayer-figure/blender_scene.py").read())
#      or: blender --background --python tools/prayer-figure/blender_scene.py
# Result: tools/prayer-figure/prayer-figure.blend with both figures (mesh, colours, armature, weights), the mat,
# a camera at the app's angle, and one keyframed position every 20 frames with a named marker for each.
# App axes (x to the qibla, y up, z to the person's right, metres) become Blender's (x, -z, y).
import bpy, json, struct, os
import numpy as np
from mathutils import Matrix, Quaternion, Vector

HERE = os.path.dirname(os.path.abspath(globals().get("__file__", ""))) if globals().get("__file__") else None
if not HERE or not os.path.exists(os.path.join(HERE, "poses.json")):
    HERE = globals().get("PRAYER_FIGURE_DIR") or HERE
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))
V = lambda p: Vector((p[0], -p[2], p[1]))
Qb = lambda q: Quaternion((q[3], q[0], -q[2], q[1]))

def load(who):
    b = open(os.path.join(ROOT, "assets", "figure", who + ".bin"), "rb").read()
    assert b[:4] == b"IEF1"
    jl = struct.unpack_from("<I", b, 4)[0]; meta = json.loads(b[8:8 + jl].decode("utf8")); o = 8 + jl; nv = meta["nv"]
    def take(dt, n):
        nonlocal o
        a = np.frombuffer(b, dt, n, o); o += a.nbytes; return a
    q = take("<u2", nv * 4).reshape(nv, 4); take("i1", nv * 4); col = take("u1", nv * 4).reshape(nv, 4)
    bi = take("u1", nv * 4).reshape(nv, 4); bw = take("u1", nv * 4).reshape(nv, 4) / 255.0; idx = take("<u4", meta["ni"]).reshape(-1, 3)
    P = np.array(meta["lo"]) + q[:, :3] * meta["sc"]
    return meta, P, col, bi, bw, idx

def build(who, poses, dx):
    meta, P, col, bi, bw, idx = load(who); bones = meta["bones"]
    me = bpy.data.meshes.new(who); me.from_pydata([V(p) for p in P], [], [tuple(int(i) for i in f) for f in idx]); me.update()
    ca = me.color_attributes.new("Col", "BYTE_COLOR", "POINT")
    for i, c in enumerate(col): ca.data[i].color = (c[0] / 255, c[1] / 255, c[2] / 255, 1)
    for p in me.polygons: p.use_smooth = True
    mat = bpy.data.materials.new(who + "-colours"); mat.use_nodes = True
    nt = mat.node_tree; bsdf = nt.nodes.get("Principled BSDF"); at = nt.nodes.new("ShaderNodeVertexColor"); at.layer_name = "Col"
    nt.links.new(at.outputs["Color"], bsdf.inputs["Base Color"]); bsdf.inputs["Roughness"].default_value = 0.85
    me.materials.append(mat)
    ob = bpy.data.objects.new(who, me); bpy.context.collection.objects.link(ob)
    for j, bn in enumerate(bones):
        g = ob.vertex_groups.new(name=bn["n"])
    for i in range(len(P)):
        for k in range(4):
            if bw[i, k] > 0: ob.vertex_groups[int(bi[i, k])].add([i], float(bw[i, k]), "REPLACE")
    arm = bpy.data.armatures.new(who + "-rig"); ao = bpy.data.objects.new(who + "-rig", arm); bpy.context.collection.objects.link(ao)
    bpy.context.view_layer.objects.active = ao; bpy.ops.object.mode_set(mode="EDIT")
    for bn in bones:
        e = arm.edit_bones.new(bn["n"]); e.head = V(bn["h"]); t = V(bn["t"])
        if (t - e.head).length < 0.01: t = e.head + Vector((0, 0, 0.03))
        e.tail = t
        if bn["p"] >= 0: e.parent = arm.edit_bones[bones[bn["p"]]["n"]]
    bpy.ops.object.mode_set(mode="OBJECT")
    ob.parent = ao; md = ob.modifiers.new("Armature", "ARMATURE"); md.object = ao
    rest = [arm.bones[bn["n"]].matrix_local.copy() for bn in bones]
    for n, (name, ps) in enumerate(poses.items()):
        fr = 1 + n * 20; M = []
        for i, bn in enumerate(bones):
            R = Qb(ps["q"][i]).to_matrix().to_4x4()
            M.append(Matrix.Translation(V(ps["p"][i])) @ R @ Matrix.Translation(-V(bn["h"])) @ rest[i])
        for i, bn in enumerate(bones):
            pb = ao.pose.bones[bn["n"]]; pb.rotation_mode = "QUATERNION"; p = bn["p"]
            pb.matrix_basis = (rest[i].inverted() @ M[i]) if p < 0 else ((rest[p].inverted() @ rest[i]).inverted() @ (M[p].inverted() @ M[i]))
            pb.keyframe_insert("location", frame=fr); pb.keyframe_insert("rotation_quaternion", frame=fr)
        if dx == 0 and name not in bpy.context.scene.timeline_markers: bpy.context.scene.timeline_markers.new(name, frame=fr)
    ao.location.y = dx
    return len(poses)

bpy.ops.wm.read_factory_settings(use_empty=True)
poses = json.load(open(os.path.join(HERE, "poses.json"), encoding="utf8"))
n = build("man", poses["man"], 0); build("woman", poses["woman"], 1.6)
sc = bpy.context.scene; sc.frame_start = 1; sc.frame_end = 1 + (n - 1) * 20; sc.render.fps = 30; sc.render.resolution_x = 1280; sc.render.resolution_y = 720
bpy.ops.mesh.primitive_plane_add(size=1, location=(0.55, 0, -0.002)); mat_ob = bpy.context.object; mat_ob.name = "mat"; mat_ob.scale = (2.1, 0.74, 1)
mm = bpy.data.materials.new("mat"); mm.diffuse_color = (0.55, 0.74, 0.68, 1); mat_ob.data.materials.append(mm)
bpy.ops.object.light_add(type="SUN", location=(1, -2, 4)); bpy.context.object.rotation_euler = (0.6, 0.2, 0.5); bpy.context.object.data.energy = 3
import math
az, el, d = math.radians(52), math.radians(13), 7.5; tgt = Vector((0.45, 0, 0.8))
bpy.ops.object.camera_add(location=tgt + Vector((d * math.cos(el) * math.cos(az), -d * math.cos(el) * math.sin(az), d * math.sin(el))))
cam = bpy.context.object; cam.data.lens = 90; cam.rotation_euler = (tgt - cam.location).to_track_quat("-Z", "Y").to_euler(); sc.camera = cam
out = os.path.join(HERE, "prayer-figure.blend"); bpy.ops.wm.save_as_mainfile(filepath=out); print("saved", out)
