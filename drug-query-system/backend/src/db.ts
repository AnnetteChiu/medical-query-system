export interface Drug {
  id: number;
  name: string;
  description: string;
  side_effects: string[];
}

export interface Interaction {
  drug_a_id: number;
  drug_b_id: number;
  description: string;
}

export const drugs: Drug[] = [
  { id: 1, name: 'Aspirin', description: '止痛、退燒、抗發炎藥物', side_effects: ['胃部不適', '出血風險', '耳鳴'] },
  { id: 2, name: 'Ibuprofen', description: '非類固醇消炎止痛藥', side_effects: ['胃痛', '噁心', '頭暈'] },
  { id: 3, name: 'Warfarin', description: '抗凝血劑', side_effects: ['出血', '瘀傷', '頭痛'] },
  { id: 4, name: 'Paracetamol', description: '退燒止痛藥', side_effects: ['肝臟損傷（過量）', '噁心'] },
  { id: 5, name: 'Metformin', description: '第二型糖尿病用藥', side_effects: ['腸胃不適', '噁心', '腹瀉'] },
  { id: 6, name: '贊安諾 (Alprazolam)', description: '苯二氮平類藥物，用於治療焦慮症與恐慌症', side_effects: ['嗜睡', '頭暈', '記憶障礙', '依賴性', '呼吸抑制'] },
];

export const interactions: Interaction[] = [
  { drug_a_id: 1, drug_b_id: 3, description: 'Aspirin 與 Warfarin 合用會增加出血風險' },
  { drug_a_id: 2, drug_b_id: 3, description: 'Ibuprofen 與 Warfarin 合用會增加出血風險' },
  { drug_a_id: 6, drug_b_id: 4, description: '贊安諾與 Paracetamol 合用可能加重中樞神經抑制' },
  { drug_a_id: 6, drug_b_id: 3, description: '贊安諾與 Warfarin 合用可能影響抗凝血效果' },
];
