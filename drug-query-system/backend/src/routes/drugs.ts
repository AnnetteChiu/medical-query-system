import { Router, Request, Response } from 'express';
import { drugs, interactions } from '../db';

const router = Router();

// 搜尋藥名
router.get('/search', (req: Request, res: Response) => {
  const q = String(req.query.q || '').toLowerCase();
  if (!q) return res.status(400).json({ error: '請提供搜尋關鍵字' });
  res.json(drugs.filter(d => d.name.toLowerCase().includes(q)));
});

// 查看單一藥物詳情
router.get('/:id', (req: Request, res: Response) => {
  const drug = drugs.find(d => d.id === Number(req.params.id));
  if (!drug) return res.status(404).json({ error: '找不到藥物' });
  res.json(drug);
});

// 查詢藥物交互作用
router.get('/:id/interactions', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = interactions
    .filter(i => i.drug_a_id === id || i.drug_b_id === id)
    .map(i => {
      const otherId = i.drug_a_id === id ? i.drug_b_id : i.drug_a_id;
      const other = drugs.find(d => d.id === otherId);
      return { drug_name: other?.name, description: i.description };
    });
  res.json(result);
});

export default router;
