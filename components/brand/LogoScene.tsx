'use client';
import { useEffect, useRef, useState } from 'react';
export default function LogoScene() {
    const host = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const el = host.current;
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return;
        let disposed = false;
        let cleanup = () => { };
        import('three').then(T => {
            if (disposed)
                return;
            let renderer: InstanceType<typeof T.WebGLRenderer>;
            try {
                renderer = new T.WebGLRenderer({ alpha: true, antialias: window.devicePixelRatio < 2, powerPreference: 'low-power' });
            }
            catch {
                return;
            }
            renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
            renderer.setClearColor(0, 0);
            renderer.outputColorSpace = T.SRGBColorSpace;
            el.appendChild(renderer.domElement);
            renderer.domElement.setAttribute('aria-hidden', 'true');
            const scene = new T.Scene(), camera = new T.PerspectiveCamera(35, 1, .1, 50);
            camera.position.z = 7.5;
            const group = new T.Group();
            scene.add(group);
            const side = new T.MeshPhysicalMaterial({ color: 0x191616, roughness: .24, metalness: .08, clearcoat: 1 });
            const body = new T.Mesh(new T.CylinderGeometry(1.68, 1.68, .28, 96), side);
            body.rotation.x = Math.PI / 2;
            group.add(body);
            const rim = new T.Mesh(new T.TorusGeometry(1.65, .055, 12, 96), side);
            rim.position.z = .14;
            group.add(rim);
            let texture: InstanceType<typeof T.Texture> | undefined;
            new T.TextureLoader().load('/logo-texture.webp', tex => {
                if (disposed) {
                    tex.dispose();
                    return;
                }
                texture = tex;
                tex.colorSpace = T.SRGBColorSpace;
                const face = new T.Mesh(new T.CircleGeometry(1.65, 96), new T.MeshPhysicalMaterial({ map: tex, roughness: .43, metalness: 0, clearcoat: .6, clearcoatRoughness: .23 }));
                face.position.z = .155;
                group.add(face);
                setReady(true);
            });
            scene.add(new T.AmbientLight(0xffffff, 2.4));
            const key = new T.DirectionalLight(0xffffff, 3.5);
            key.position.set(-3, 5, 6);
            scene.add(key);
            const fill = new T.DirectionalLight(0xffc4dd, 1.5);
            fill.position.set(4, 0, 3);
            scene.add(fill);
            let visible = true, frame = 0, px = 0, py = 0, scrollProgress = 0;
            const scroll = () => { scrollProgress = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / window.innerHeight)); };
            window.addEventListener("scroll", scroll, { passive: true });
            const start = performance.now();
            const resize = () => { const { width, height } = el.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); };
            resize();
            const ro = new ResizeObserver(resize);
            ro.observe(el);
            const move = (e: PointerEvent) => { const b = el.getBoundingClientRect(); px = ((e.clientX - b.left) / b.width - .5) * .38; py = ((e.clientY - b.top) / b.height - .5) * .25; };
            const leave = () => { px = py = 0; };
            el.addEventListener('pointermove', move);
            el.addEventListener('pointerleave', leave);
            const draw = () => { if (disposed || !visible || document.hidden)
                return; const t = (performance.now() - start) / 1000; group.rotation.y += (px + .08 * Math.sin(t * .65) - group.rotation.y) * .07; group.rotation.x += (-py + .055 * Math.cos(t * .6) - group.rotation.x) * .07; group.rotation.z = -.1 + .025 * Math.sin(t * .7); group.position.y = .07 * Math.sin(t * .8) + scrollProgress * .25; group.scale.setScalar(1 - scrollProgress * .12); renderer.render(scene, camera); frame = requestAnimationFrame(draw); };
            const restart = () => { cancelAnimationFrame(frame); draw(); };
            const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; restart(); });
            io.observe(el);
            document.addEventListener('visibilitychange', restart);
            draw();
            cleanup = () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', restart); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); scene.traverse(o => { if (o instanceof T.Mesh) {
                o.geometry.dispose();
                const mats = Array.isArray(o.material) ? o.material : [o.material];
                mats.forEach(m => m.dispose());
            } }); texture?.dispose(); renderer.dispose(); renderer.domElement.remove(); };
        }).catch(() => { });
        return () => { disposed = true; cleanup(); };
    }, []);
    return <div className={`logo-scene ${ready ? 'is-ready' : ''}`} ref={host} role="img" aria-label="Uliczny Absurd — przestrzenny emblemat z mikrofonem"><img className="logo-fallback" src="/logo-texture.webp" alt="" fetchPriority="high"/><span className="logo-shadow"/></div>;
}
