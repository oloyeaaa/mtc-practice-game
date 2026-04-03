'use client';

import { useEffect, useRef } from 'react';
import { ShapeData } from '../lib/types';

export default function ShapeCanvas({ shape }: { shape: ShapeData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const scale = 18;

    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (shape.type === 'rect' && shape.w && shape.h) {
      const pw = shape.w * scale, ph = shape.h * scale;
      const x = (W - pw) / 2, y = (H - ph) / 2;
      ctx.fillStyle = 'rgba(59,130,246,0.25)';
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.fillRect(x, y, pw, ph);
      ctx.strokeRect(x, y, pw, ph);
      ctx.fillStyle = '#fff';
      ctx.fillText(shape.w + ' cm', x + pw / 2, y - 14);
      ctx.fillText(shape.h + ' cm', x - 20, y + ph / 2);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      for (let gx = 1; gx < shape.w; gx++) {
        for (let gy = 1; gy < shape.h; gy++) {
          ctx.beginPath();
          ctx.arc(x + gx * scale, y + gy * scale, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (shape.type === 'lshape' && shape.ow && shape.oh && shape.cw && shape.ch) {
      const { ow, oh, cw, ch } = shape;
      const pw = ow * scale, ph = oh * scale;
      const cx = cw * scale, cy = ch * scale;
      const x = (W - pw) / 2, y = (H - ph) / 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (pw - cx), y);
      ctx.lineTo(x + (pw - cx), y + cy);
      ctx.lineTo(x + pw, y + cy);
      ctx.lineTo(x + pw, y + ph);
      ctx.lineTo(x, y + ph);
      ctx.closePath();
      ctx.fillStyle = 'rgba(34,197,94,0.25)';
      ctx.fill();
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillText((ow - cw) + ' cm', x + (pw - cx) / 2, y - 12);
      ctx.fillText(oh + ' cm', x - 18, y + ph / 2);
      ctx.fillText(ow + ' cm', x + pw / 2, y + ph + 16);
      ctx.fillText(cw + ' cm', x + (pw - cx) + cx / 2, y + cy + 14);
      ctx.fillText(ch + ' cm', x + pw + 18, y + cy / 2);
      ctx.fillText((oh - ch) + ' cm', x + pw + 18, y + cy + (ph - cy) / 2);
    } else if (shape.type === 'compound' && shape.w1 && shape.h1 && shape.w2 && shape.h2) {
      const { w1, h1, w2, h2 } = shape;
      const pw1 = w1 * scale, ph1 = h1 * scale;
      const pw2 = w2 * scale, ph2 = h2 * scale;
      const totalW = pw1 + pw2 + 10;
      const sx = (W - totalW) / 2;
      const y1 = (H - ph1) / 2, y2 = (H - ph2) / 2;
      ctx.fillStyle = 'rgba(59,130,246,0.25)'; ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 3;
      ctx.fillRect(sx, y1, pw1, ph1); ctx.strokeRect(sx, y1, pw1, ph1);
      ctx.fillStyle = '#fff';
      ctx.fillText(w1 + ' cm', sx + pw1 / 2, y1 - 12);
      ctx.fillText(h1 + ' cm', sx - 16, y1 + ph1 / 2);
      const sx2 = sx + pw1 + 10;
      ctx.fillStyle = 'rgba(168,85,247,0.25)'; ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 3;
      ctx.fillRect(sx2, y2, pw2, ph2); ctx.strokeRect(sx2, y2, pw2, ph2);
      ctx.fillStyle = '#fff';
      ctx.fillText(w2 + ' cm', sx2 + pw2 / 2, y2 - 12);
      ctx.fillText(h2 + ' cm', sx2 + pw2 + 16, y2 + ph2 / 2);
    }
  }, [shape]);

  return <canvas ref={canvasRef} width={320} height={180} className="mx-auto rounded-xl" />;
}
