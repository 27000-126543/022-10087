export interface Contraindication {
  id: string
  name: string
  description: string
  severity: 'critical' | 'warning'
  relatedProjects: string[]
  mustAsk: string
}

const contraindications: Contraindication[] = [
  {
    id: 'contra-pregnancy',
    name: '孕期/哺乳期',
    description: '怀孕期间及哺乳期女性，体内激素水平变化大，且治疗可能对胎儿或婴儿产生潜在影响，绝大多数医美项目均不可进行。',
    severity: 'critical',
    relatedProjects: ['proj-thermage', 'proj-water-shine', 'proj-botox', 'proj-hyaluronic', 'proj-pico-laser', 'proj-ipl', 'proj-hifu', 'proj-thread-lift', 'proj-slimface-botox', 'proj-oustar'],
    mustAsk: '请问您目前是否处于孕期或哺乳期？',
  },
  {
    id: 'contra-scar-constitution',
    name: '瘢痕体质',
    description: '瘢痕体质者伤口愈合后易形成增生性瘢痕或瘢痕疙瘩，任何有创操作（注射、激光、手术）都有瘢痕增生风险。',
    severity: 'critical',
    relatedProjects: ['proj-water-shine', 'proj-botox', 'proj-hyaluronic', 'proj-pico-laser', 'proj-thread-lift', 'proj-slimface-botox'],
    mustAsk: '请问您是否有瘢痕体质？以前受伤后伤口是否容易留凸起的疤？',
  },
  {
    id: 'contra-recent-medication',
    name: '近期服药（阿司匹林/消炎药）',
    description: '阿司匹林、布洛芬等非甾体消炎药以及抗凝药物会增加出血和淤青风险，注射类和有创项目需停药后进行。',
    severity: 'warning',
    relatedProjects: ['proj-water-shine', 'proj-botox', 'proj-hyaluronic', 'proj-thread-lift', 'proj-slimface-botox'],
    mustAsk: '请问您近期是否在服用阿司匹林、消炎药或抗凝药物？',
  },
  {
    id: 'contra-skin-break',
    name: '皮肤破损/感染',
    description: '治疗区域有开放性伤口、感染、疱疹发作等情况时，进行任何治疗可能加重感染或导致瘢痕，需痊愈后再做。',
    severity: 'critical',
    relatedProjects: ['proj-thermage', 'proj-water-shine', 'proj-botox', 'proj-hyaluronic', 'proj-pico-laser', 'proj-ipl', 'proj-hifu', 'proj-thread-lift', 'proj-oustar'],
    mustAsk: '请问您治疗区域目前是否有伤口、感染或疱疹发作？',
  },
  {
    id: 'contra-severe-allergy',
    name: '严重过敏史',
    description: '对玻尿酸、利多卡因、蛋白线等成分有严重过敏史的客人，需评估是否可以使用替代方案或进行脱敏处理。',
    severity: 'critical',
    relatedProjects: ['proj-water-shine', 'proj-botox', 'proj-hyaluronic', 'proj-thread-lift', 'proj-slimface-botox'],
    mustAsk: '请问您是否有严重过敏史？特别是对麻药、玻尿酸或其他医美产品过敏？',
  },
  {
    id: 'contra-immune-disease',
    name: '免疫系统疾病',
    description: '系统性红斑狼疮、硬皮病等自身免疫性疾病患者，光电类治疗可能诱发病情活动，注射类也需谨慎评估。',
    severity: 'critical',
    relatedProjects: ['proj-thermage', 'proj-pico-laser', 'proj-ipl', 'proj-hifu', 'proj-oustar'],
    mustAsk: '请问您是否患有免疫系统疾病，如红斑狼疮、硬皮病等？',
  },
  {
    id: 'contra-pacemaker',
    name: '心脏起搏器',
    description: '佩戴心脏起搏器者不可接受射频类（热玛吉）和超声类（超声刀）治疗，电磁干扰可能影响起搏器正常工作。',
    severity: 'critical',
    relatedProjects: ['proj-thermage', 'proj-hifu'],
    mustAsk: '请问您是否佩戴心脏起搏器或其他体内电子设备？',
  },
  {
    id: 'contra-recent-injection',
    name: '近期注射史',
    description: '近期（2周内）做过其他注射类项目（玻尿酸、肉毒等）的部位，不建议短期内再次注射，避免叠加反应和效果干扰。',
    severity: 'warning',
    relatedProjects: ['proj-water-shine', 'proj-botox', 'proj-hyaluronic', 'proj-thread-lift', 'proj-slimface-botox'],
    mustAsk: '请问您近两周内是否做过其他注射类项目？具体是什么项目和部位？',
  },
]

export default contraindications
