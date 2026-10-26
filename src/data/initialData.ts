import { Topic, Question, Flashcard, SubtopicNote, PastPaperQuestion } from '../types';

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'Unit 1: Organisms and Life Processes',
    subtopics: [
      { id: '1', topic_id: 'unit-1', code: '1', title: 'Life processes', estimated_minutes: 10, question_count: 5, flashcard_count: 5 },
      { id: '2', topic_id: 'unit-1', code: '2', title: 'The variety of living organisms', estimated_minutes: 15, question_count: 5, flashcard_count: 5 }
    ]
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'Unit 2: Animal Physiology',
    subtopics: [
      { id: '3', topic_id: 'unit-2', code: '3', title: 'Breathing and gas exchange', estimated_minutes: 14, question_count: 5, flashcard_count: 5 },
      { id: '4', topic_id: 'unit-2', code: '4', title: 'Food and digestion', estimated_minutes: 15, question_count: 5, flashcard_count: 5 },
      { id: '5', topic_id: 'unit-2', code: '5', title: 'Blood and circulation', estimated_minutes: 16, question_count: 5, flashcard_count: 5 },
      { id: '6', topic_id: 'unit-2', code: '6', title: 'Coordination', estimated_minutes: 15, question_count: 5, flashcard_count: 5 },
      { id: '7', topic_id: 'unit-2', code: '7', title: 'Chemical coordination', estimated_minutes: 14, question_count: 5, flashcard_count: 5 },
      { id: '8', topic_id: 'unit-2', code: '8', title: 'Homeostasis and excretion', estimated_minutes: 15, question_count: 5, flashcard_count: 5 },
      { id: '9', topic_id: 'unit-2', code: '9', title: 'Reproduction in humans', estimated_minutes: 16, question_count: 5, flashcard_count: 5 }
    ]
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'Unit 3: Plant Physiology',
    subtopics: [
      { id: '10', topic_id: 'unit-3', code: '10', title: 'Plants and food', estimated_minutes: 15, question_count: 5, flashcard_count: 5 },
      { id: '11', topic_id: 'unit-3', code: '11', title: 'Transport in plants', estimated_minutes: 14, question_count: 5, flashcard_count: 5 },
      { id: '12', topic_id: 'unit-3', code: '12', title: 'Chemical coordination in plants', estimated_minutes: 12, question_count: 5, flashcard_count: 5 },
      { id: '13', topic_id: 'unit-3', code: '13', title: 'Reproduction in plants', estimated_minutes: 15, question_count: 5, flashcard_count: 5 }
    ]
  },
  {
    id: 'unit-4',
    number: 4,
    title: 'Unit 4: Ecology and the Environment',
    subtopics: [
      { id: '14', topic_id: 'unit-4', code: '14', title: 'Ecosystems', estimated_minutes: 14, question_count: 5, flashcard_count: 5 },
      { id: '15', topic_id: 'unit-4', code: '15', title: 'Human influences on the environment', estimated_minutes: 14, question_count: 5, flashcard_count: 5 }
    ]
  },
  {
    id: 'unit-5',
    number: 5,
    title: 'Unit 5: Variation and Selection',
    subtopics: [
      { id: '16', topic_id: 'unit-5', code: '16', title: 'Chromosomes, genes and DNA', estimated_minutes: 15, question_count: 5, flashcard_count: 5 },
      { id: '17', topic_id: 'unit-5', code: '17', title: 'Cell division', estimated_minutes: 15, question_count: 5, flashcard_count: 5 },
      { id: '18', topic_id: 'unit-5', code: '18', title: 'Genes and inheritance', estimated_minutes: 18, question_count: 5, flashcard_count: 5 },
      { id: '19', topic_id: 'unit-5', code: '19', title: 'Natural selection and evolution', estimated_minutes: 14, question_count: 5, flashcard_count: 5 },
      { id: '20', topic_id: 'unit-5', code: '20', title: 'Selective breeding', estimated_minutes: 12, question_count: 5, flashcard_count: 5 }
    ]
  },
  {
    id: 'unit-6',
    number: 6,
    title: 'Unit 6: Microorganisms and Genetic Modification',
    subtopics: [
      { id: '21', topic_id: 'unit-6', code: '21', title: 'Using microorganisms', estimated_minutes: 14, question_count: 5, flashcard_count: 5 },
      { id: '22', topic_id: 'unit-6', code: '22', title: 'Genetic modification', estimated_minutes: 16, question_count: 5, flashcard_count: 5 }
    ]
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Chapter 1: Life processes
  {
    id: 'q-1-1',
    topic_id: '1',
    subtopic_id: '1',
    question: 'Which life process describes the release of chemical energy (ATP) from glucose within living cells?',
    options: ['Breathing', 'Cellular respiration', 'Photosynthesis', 'Excretion'],
    correct_answer_index: 1,
    explanation: 'Respiration is the intracellular biochemical reaction that oxidizes glucose to release energy as ATP. Breathing is merely mechanical ventilation.'
  },
  {
    id: 'q-1-2',
    topic_id: '1',
    subtopic_id: '1',
    question: 'What is the biological definition of excretion?',
    options: [
      'The elimination of undigested food as faeces',
      'The removal of metabolic waste products, toxic substances, and substances in excess',
      'The transport of nutrients into body cells',
      'The absorption of water in the large intestine'
    ],
    correct_answer_index: 1,
    explanation: 'Excretion is the elimination of waste substances produced by chemical reactions inside cells (e.g. urea, carbon dioxide). Elimination of faeces is egestion.'
  },
  {
    id: 'q-1-3',
    topic_id: '1',
    subtopic_id: '1',
    question: 'What does homeostasis refer to in living organisms?',
    options: [
      'The maintenance of a constant internal environment',
      'The digestion of food in the gut',
      'The permanent increase in body size',
      'The production of offspring'
    ],
    correct_answer_index: 0,
    explanation: 'Homeostasis is the regulation of internal conditions (such as temperature, water potential, and blood glucose level) within narrow physiological limits.'
  },
  {
    id: 'q-1-4',
    topic_id: '1',
    subtopic_id: '1',
    question: 'Sensitivity allows organisms to do which of the following?',
    options: [
      'Produce digestive enzymes in lysosomes',
      'Detect and respond to changes in the internal or external environment',
      'Replicate genetic material before cell division',
      'Store surplus carbohydrate as glycogen'
    ],
    correct_answer_index: 1,
    explanation: 'Sensitivity is the capacity to detect stimuli (such as light, sound, chemicals, or temperature) and execute appropriate physiological responses.'
  },

  // Chapter 2: The variety of living organisms
  {
    id: 'q-2-1',
    topic_id: '2',
    subtopic_id: '2',
    question: 'Which kingdom includes organisms with cell walls made of chitin that feed by saprotrophic nutrition?',
    options: ['Plantae', 'Fungi', 'Protoctista', 'Animalia'],
    correct_answer_index: 1,
    explanation: 'Fungi have chitin cell walls, store carbohydrates as glycogen, and secrete extracellular enzymes to absorb digested nutrients saprotrophically.'
  },
  {
    id: 'q-2-2',
    topic_id: '2',
    subtopic_id: '2',
    question: 'Which of the following organisms are classified as prokaryotes?',
    options: ['Yeast and Mucor', 'Bacteria (e.g., Lactobacillus and Pneumococcus)', 'Chlorella and Amoeba', 'Influenza and HIV'],
    correct_answer_index: 1,
    explanation: 'Bacteria are prokaryotes because they lack a membrane-bound nucleus and membrane-bound organelles.'
  },
  {
    id: 'q-2-3',
    topic_id: '2',
    subtopic_id: '2',
    question: 'Why are viruses not considered living cells?',
    options: [
      'They contain both DNA and RNA simultaneously',
      'They are acellular particles that lack cytoplasm and can only reproduce inside host cells',
      'They have thick cellulose cell walls',
      'They carry out anaerobic respiration exclusively'
    ],
    correct_answer_index: 1,
    explanation: 'Viruses have no cellular structure, membranes, or metabolism of their own; they consist of nucleic acid wrapped in a protein coat and parasitize host machinery.'
  },

  // Chapter 3: Breathing and gas exchange
  {
    id: 'q-3-1',
    topic_id: '3',
    subtopic_id: '3',
    question: 'During inhalation in humans, what changes occur in the diaphragm and external intercostal muscles?',
    options: [
      'Diaphragm contracts (flattens), external intercostals contract',
      'Diaphragm relaxes (domes), external intercostals relax',
      'Diaphragm contracts, external intercostals relax',
      'Both muscles relax completely'
    ],
    correct_answer_index: 0,
    explanation: 'During inhalation, the diaphragm contracts and flattens while external intercostal muscles pull the ribs up and out, increasing thorax volume and lowering pressure.'
  },
  {
    id: 'q-3-2',
    topic_id: '3',
    subtopic_id: '3',
    question: 'Which adaptation of alveoli minimizes the diffusion distance for respiratory gases?',
    options: [
      'A wall that is only one cell thick and surrounded by capillaries',
      'A dry epithelial layer',
      'A small surface area to volume ratio',
      'A thick cartilage outer ring'
    ],
    correct_answer_index: 0,
    explanation: 'Alveoli walls are composed of a single thin layer of flattened epithelial cells, providing a very short diffusion pathway for O2 and CO2.'
  },

  // Chapter 4: Food and digestion
  {
    id: 'q-4-1',
    topic_id: '4',
    subtopic_id: '4',
    question: 'Where is bile produced, and what is its role in lipid digestion?',
    options: [
      'Produced in the pancreas; chemically digests lipids into amino acids',
      'Produced in the liver; emulsifies large fat droplets into tiny droplets',
      'Produced in the gall bladder; converts fatty acids into glucose',
      'Produced in the stomach; neutralizes saliva'
    ],
    correct_answer_index: 1,
    explanation: 'Bile is synthesized by the liver and stored in the gall bladder. It neutralizes stomach acid and emulsifies fats, creating a huge surface area for lipase.'
  },
  {
    id: 'q-4-2',
    topic_id: '4',
    subtopic_id: '4',
    question: 'Which enzyme breaks down starch into maltose?',
    options: ['Lipase', 'Amylase', 'Protease', 'Maltase'],
    correct_answer_index: 1,
    explanation: 'Amylase (in saliva and pancreatic juice) hydrolyzes starch into the disaccharide maltose.'
  },

  // Chapter 5: Blood and circulation
  {
    id: 'q-5-1',
    topic_id: '5',
    subtopic_id: '5',
    question: 'Why does the left ventricle have a much thicker muscular wall than the right ventricle?',
    options: [
      'It pumps oxygen-depleted blood to the adjacent lungs',
      'It must generate higher pressure to pump oxygenated blood around the entire systemic circulation',
      'It contains more valves to withstand backflow',
      'It receives blood directly from the vena cava'
    ],
    correct_answer_index: 1,
    explanation: 'The left ventricle pumps blood around the entire systemic body circulation against higher resistance, requiring a thicker, more muscular myocardium.'
  },

  // Chapter 6: Coordination
  {
    id: 'q-6-1',
    topic_id: '6',
    subtopic_id: '6',
    question: 'What is the correct pathway of an electrical nerve impulse in a spinal reflex arc?',
    options: [
      'Effector → Motor neurone → Relay neurone → Sensory neurone → Receptor',
      'Receptor → Sensory neurone → Relay neurone → Motor neurone → Effector',
      'Receptor → Relay neurone → Brain → Motor neurone → Effector',
      'Motor neurone → Sensory neurone → Effector'
    ],
    correct_answer_index: 1,
    explanation: 'A reflex arc travels from Receptor → Sensory neurone → Relay neurone (in spinal cord gray matter) → Motor neurone → Effector muscle/gland.'
  },

  // Chapter 7: Chemical coordination
  {
    id: 'q-7-1',
    topic_id: '7',
    subtopic_id: '7',
    question: 'Which hormone is secreted by the pancreas in response to high blood glucose concentrations?',
    options: ['Glucagon', 'Insulin', 'Adrenaline', 'Thyroxine'],
    correct_answer_index: 1,
    explanation: 'Insulin stimulates liver and muscle cells to absorb glucose and convert it into stored insoluble glycogen.'
  },

  // Chapter 8: Homeostasis and excretion
  {
    id: 'q-8-1',
    topic_id: '8',
    subtopic_id: '8',
    question: 'How does the human nephron respond to dehydration when ADH (antidiuretic hormone) is released?',
    options: [
      'The collecting duct becomes more permeable, reabsorbing more water into the blood',
      'The Bowman capsule filters fewer mineral ions',
      'The bladder secretes more dilute urine',
      'The loop of Henle stops active salt transport'
    ],
    correct_answer_index: 0,
    explanation: 'ADH makes the collecting duct walls more permeable to water, causing increased reabsorption into blood capillaries and producing concentrated, low-volume urine.'
  },

  // Chapter 9: Reproduction in humans
  {
    id: 'q-9-1',
    topic_id: '9',
    subtopic_id: '9',
    question: 'Where does fertilization typically take place in the female human reproductive system?',
    options: ['Ovary', 'Fallopian tube (oviduct)', 'Uterus wall', 'Cervix'],
    correct_answer_index: 1,
    explanation: 'Fertilization (fusion of sperm and egg nuclei) typically occurs in the upper third of the Fallopian tube / oviduct.'
  },

  // Chapter 10: Plants and food
  {
    id: 'q-10-1',
    topic_id: '10',
    subtopic_id: '10',
    question: 'What are the products of oxygenic photosynthesis in green plants?',
    options: [
      'Glucose and oxygen',
      'Carbon dioxide and water',
      'Lactic acid and ATP',
      'Cellulose and nitrogen'
    ],
    correct_answer_index: 0,
    explanation: 'In photosynthesis: 6CO2 + 6H2O → C6H12O6 + 6O2 using absorbed light energy in chloroplasts.'
  },

  // Chapter 11: Transport in plants
  {
    id: 'q-11-1',
    topic_id: '11',
    subtopic_id: '11',
    question: 'Which vascular tissue transports water and mineral ions upwards from roots to leaves in a plant?',
    options: ['Phloem', 'Xylem', 'Cortex', 'Pith'],
    correct_answer_index: 1,
    explanation: 'Xylem vessels are dead, hollow tubes reinforced with lignin that conduct water and dissolved minerals upwards via transpiration pull.'
  },

  // Chapter 12: Chemical coordination in plants
  {
    id: 'q-12-1',
    topic_id: '12',
    subtopic_id: '12',
    question: 'How does the plant hormone auxin cause a shoot to bend towards unidirectional light (positive phototropism)?',
    options: [
      'Auxin breaks down on the shaded side',
      'Auxin diffuses to the shaded side, stimulating cell elongation on that side',
      'Auxin stops cells dividing on the lit side',
      'Auxin triggers immediate stomatal closure'
    ],
    correct_answer_index: 1,
    explanation: 'Auxin accumulates on the shaded side of the shoot tip, causing those cells to elongate faster than cells on the illuminated side, bending the shoot toward light.'
  },

  // Chapter 13: Reproduction in plants
  {
    id: 'q-13-1',
    topic_id: '13',
    subtopic_id: '13',
    question: 'What is the function of the flower anther?',
    options: [
      'To produce and release pollen grains containing male gametes',
      'To receive pollen grains during pollination',
      'To protect the developing flower bud',
      'To develop into a seed after fertilization'
    ],
    correct_answer_index: 0,
    explanation: 'The anther (part of the stamen) produces and releases pollen grains carrying male gamete nuclei.'
  },

  // Chapter 14: Ecosystems
  {
    id: 'q-14-1',
    topic_id: '14',
    subtopic_id: '14',
    question: 'Why is only approximately 10% of energy transferred from one trophic level to the next?',
    options: [
      'Energy is lost through respiration, excretion, heat, and uneaten biomass',
      'Plants reflect 90% of visible light',
      'Carnivores destroy energy permanently',
      'Decomposers absorb all consumer nutrients'
    ],
    correct_answer_index: 0,
    explanation: 'Energy is lost at each trophic step due to cellular respiration, heat dissipation, incomplete digestion, excretion, and unconsumed body parts.'
  },

  // Chapter 15: Human influences on the environment
  {
    id: 'q-15-1',
    topic_id: '15',
    subtopic_id: '15',
    question: 'What environmental disaster occurs when excess agricultural fertilizer leaches into freshwater lakes?',
    options: ['Eutrophication', 'Bioaccumulation', 'Deforestation', 'Ozone depletion'],
    correct_answer_index: 0,
    explanation: 'Eutrophication occurs when excess nitrates and phosphates cause rapid algal bloom; algae die and decomposers multiply, depleting oxygen and suffocating aquatic life.'
  },

  // Chapter 16: Chromosomes, genes and DNA
  {
    id: 'q-16-1',
    topic_id: '16',
    subtopic_id: '16',
    question: 'Which complementary base pairs form the rungs of the double-helix DNA molecule?',
    options: [
      'Adenine with Thymine; Cytosine with Guanine',
      'Adenine with Guanine; Cytosine with Thymine',
      'Adenine with Uracil; Cytosine with Guanine',
      'Thymine with Guanine; Adenine with Cytosine'
    ],
    correct_answer_index: 0,
    explanation: 'In DNA, Adenine (A) always pairs with Thymine (T) via 2 hydrogen bonds, and Cytosine (C) pairs with Guanine (G) via 3 hydrogen bonds.'
  },

  // Chapter 17: Cell division
  {
    id: 'q-17-1',
    topic_id: '17',
    subtopic_id: '17',
    question: 'What are the genetic characteristics of the daughter cells produced by mitosis?',
    options: [
      'Two genetically identical diploid daughter cells',
      'Four genetically unique haploid gametes',
      'Two haploid cells with half the original chromosomes',
      'Four diploid cells with crossing over'
    ],
    correct_answer_index: 0,
    explanation: 'Mitosis produces two genetically identical diploid daughter cells, essential for growth, tissue repair, and asexual reproduction.'
  },

  // Chapter 18: Genes and inheritance
  {
    id: 'q-18-1',
    topic_id: '18',
    subtopic_id: '18',
    question: 'If two heterozygous parents (Bb) are crossed, what is the expected phenotypic ratio for a dominant trait?',
    options: ['3 : 1', '1 : 2 : 1', '1 : 1', '4 : 0'],
    correct_answer_index: 0,
    explanation: 'The genotypic outcome is 1 BB : 2 Bb : 1 bb. Since both BB and Bb show the dominant phenotype, the phenotypic ratio is 3 dominant : 1 recessive.'
  },

  // Chapter 19: Natural selection and evolution
  {
    id: 'q-19-1',
    topic_id: '19',
    subtopic_id: '19',
    question: 'What is the primary driving mechanism of Darwinian natural selection?',
    options: [
      'Organisms with advantageous alleles are more likely to survive, reproduce, and pass on those alleles',
      'Organisms acquire desired characteristics during their lifetime and pass them on',
      'Mutations always occur deliberately when an environmental threat appears',
      'Predators choose only the largest individuals to eliminate'
    ],
    correct_answer_index: 0,
    explanation: 'Natural selection acts on random genetic variation; individuals possessing advantageous alleles have higher survival and reproductive fitness in their environment.'
  },

  // Chapter 20: Selective breeding
  {
    id: 'q-20-1',
    topic_id: '20',
    subtopic_id: '20',
    question: 'How do humans carry out artificial selection (selective breeding) in agriculture?',
    options: [
      'By selecting and breeding parents with desired traits over multiple successive generations',
      'By inserting recombinant bacterial plasmids into plant stems',
      'By exposing seeds to intense gamma radiation',
      'By cloning identical cells in bioreactors'
    ],
    correct_answer_index: 0,
    explanation: 'Selective breeding involves humans choosing individuals with desirable characteristics (such as high milk yield or disease resistance) and breeding them across generations.'
  },

  // Chapter 21: Using microorganisms
  {
    id: 'q-21-1',
    topic_id: '21',
    subtopic_id: '21',
    question: 'Which microorganism is used in bread making to produce carbon dioxide gas that causes dough to rise?',
    options: ['Yeast (Saccharomyces cerevisiae)', 'Lactobacillus bulgaricus', 'Penicillium chrysogenum', 'Spirulina'],
    correct_answer_index: 0,
    explanation: 'Yeast respires anaerobically (ferments) to produce ethanol and carbon dioxide; the trapped CO2 bubbles expand during baking, making bread light and fluffy.'
  },

  // Chapter 22: Genetic modification
  {
    id: 'q-22-1',
    topic_id: '22',
    subtopic_id: '22',
    question: 'Which enzyme is used to cut DNA at specific palindromic sequences to isolate a desired gene?',
    options: ['Restriction endonucleases', 'DNA ligase', 'RNA polymerase', 'Amylase'],
    correct_answer_index: 0,
    explanation: 'Restriction enzymes cut DNA at specific recognition sequences, leaving sticky ends. DNA ligase is then used to join the sticky ends together.'
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  // Chapter 1: Life processes
  {
    id: 'fc-1-1',
    topic_id: '1',
    subtopic_id: '1',
    term: 'Cellular Respiration',
    definition: 'The biochemical reaction in cells that breaks down glucose in the presence or absence of oxygen to release energy as ATP.'
  },
  {
    id: 'fc-1-2',
    topic_id: '1',
    subtopic_id: '1',
    term: 'Homeostasis',
    definition: 'The maintenance of a constant internal environment (e.g. body temperature, water content, blood glucose) despite external changes.'
  },
  {
    id: 'fc-1-3',
    topic_id: '1',
    subtopic_id: '1',
    term: 'Excretion',
    definition: 'The removal of toxic metabolic waste products, substances in excess, and chemical by-products produced inside cells.'
  },

  // Chapter 2: The variety of living organisms
  {
    id: 'fc-2-1',
    topic_id: '2',
    subtopic_id: '2',
    term: 'Saprotrophic Nutrition',
    definition: 'Extracellular digestion of dead organic matter by secreted enzymes, followed by absorption of soluble digested nutrients.'
  },
  {
    id: 'fc-2-2',
    topic_id: '2',
    subtopic_id: '2',
    term: 'Pathogen',
    definition: 'A biological agent capable of causing disease in a host (e.g., pathogenic bacteria, viruses, fungi, protoctists).'
  },

  // Chapter 3: Breathing and gas exchange
  {
    id: 'fc-3-1',
    topic_id: '3',
    subtopic_id: '3',
    term: 'Alveoli Adaptations',
    definition: 'Huge surface area, one-cell-thick epithelium for short diffusion distance, moist lining, and extensive capillary blood supply.'
  },

  // Chapter 4: Food and digestion
  {
    id: 'fc-4-1',
    topic_id: '4',
    subtopic_id: '4',
    term: 'Bile & Emulsification',
    definition: 'Bile neutralizes stomach acid and breaks large lipid globules into microscopic droplets, vastly increasing surface area for lipase.'
  },

  // Chapter 5: Blood and circulation
  {
    id: 'fc-5-1',
    topic_id: '5',
    subtopic_id: '5',
    term: 'Left Ventricle Wall',
    definition: 'Thick muscular wall that contracts powerfully to pump oxygenated blood under high pressure through the aorta to the whole body.'
  },

  // Chapter 6: Coordination
  {
    id: 'fc-6-1',
    topic_id: '6',
    subtopic_id: '6',
    term: 'Reflex Arc',
    definition: 'Rapid, involuntary neural pathway: Receptor → Sensory Neurone → Relay Neurone (spinal cord) → Motor Neurone → Effector.'
  },

  // Chapter 7: Chemical coordination
  {
    id: 'fc-7-1',
    topic_id: '7',
    subtopic_id: '7',
    term: 'Insulin',
    definition: 'Pancreatic hormone that lowers elevated blood glucose by prompting liver and muscle cells to take up glucose and synthesize glycogen.'
  },

  // Chapter 8: Homeostasis and excretion
  {
    id: 'fc-8-1',
    topic_id: '8',
    subtopic_id: '8',
    term: 'ADH (Antidiuretic Hormone)',
    definition: 'Hormone from the pituitary gland that increases water permeability of kidney collecting ducts, conserving water in the body.'
  },

  // Chapter 9: Reproduction in humans
  {
    id: 'fc-9-1',
    topic_id: '9',
    subtopic_id: '9',
    term: 'Fertilisation',
    definition: 'The fusion of a haploid sperm nucleus with a haploid ovum nucleus in the Fallopian tube to form a diploid zygote.'
  },

  // Chapter 10: Plants and food
  {
    id: 'fc-10-1',
    topic_id: '10',
    subtopic_id: '10',
    term: 'Photosynthesis Equation',
    definition: '6CO2 + 6H2O → C6H12O6 + 6O2, requiring light energy absorbed by chlorophyll pigments in chloroplasts.'
  },

  // Chapter 11: Transport in plants
  {
    id: 'fc-11-1',
    topic_id: '11',
    subtopic_id: '11',
    term: 'Transpiration Stream',
    definition: 'The continuous upward movement of water and mineral ions through xylem vessels driven by evaporation of water from stomata.'
  },

  // Chapter 12: Chemical coordination in plants
  {
    id: 'fc-12-1',
    topic_id: '12',
    subtopic_id: '12',
    term: 'Auxin Phototropism',
    definition: 'Auxin accumulates on the shaded side of shoot tips, stimulating unequal cell elongation and causing shoots to bend toward light.'
  },

  // Chapter 13: Reproduction in plants
  {
    id: 'fc-13-1',
    topic_id: '13',
    subtopic_id: '13',
    term: 'Pollination',
    definition: 'The transfer of pollen grains from an anther to a receptive stigma via insects, wind, or birds.'
  },

  // Chapter 14: Ecosystems
  {
    id: 'fc-14-1',
    topic_id: '14',
    subtopic_id: '14',
    term: 'Trophic Level Efficiency',
    definition: 'Only ~10% of biomass energy passes to the next trophic level due to metabolic respiration losses, heat, excretion, and unconsumed parts.'
  },

  // Chapter 15: Human influences on the environment
  {
    id: 'fc-15-1',
    topic_id: '15',
    subtopic_id: '15',
    term: 'Eutrophication',
    definition: 'Nutrient enrichment of water bodies causing algal blooms, light blockage, death of plants, and microbial oxygen depletion killing aquatic life.'
  },

  // Chapter 16: Chromosomes, genes and DNA
  {
    id: 'fc-16-1',
    topic_id: '16',
    subtopic_id: '16',
    term: 'DNA Structure & Base Pairing',
    definition: 'A double-helix polymer composed of nucleotide units; complementary pairs are Adenine-Thymine (A-T) and Cytosine-Guanine (C-G).'
  },

  // Chapter 17: Cell division
  {
    id: 'fc-17-1',
    topic_id: '17',
    subtopic_id: '17',
    term: 'Mitosis vs Meiosis',
    definition: 'Mitosis produces two genetically identical diploid cells for growth; meiosis produces four genetically unique haploid gametes.'
  },

  // Chapter 18: Genes and inheritance
  {
    id: 'fc-18-1',
    topic_id: '18',
    subtopic_id: '18',
    term: 'Heterozygous vs Homozygous',
    definition: 'Homozygous individuals have two identical alleles (e.g. BB or bb); heterozygous individuals have two differing alleles (Bb).'
  },

  // Chapter 19: Natural selection and evolution
  {
    id: 'fc-19-1',
    topic_id: '19',
    subtopic_id: '19',
    term: 'Natural Selection',
    definition: 'Differential survival and reproduction of individuals with advantageous genetic variations, shifting allele frequencies over generations.'
  },

  // Chapter 20: Selective breeding
  {
    id: 'fc-20-1',
    topic_id: '20',
    subtopic_id: '20',
    term: 'Artificial Selection',
    definition: 'Selective breeding by humans of parents showing desirable economic traits over many generations to enhance specific phenotypes.'
  },

  // Chapter 21: Using microorganisms
  {
    id: 'fc-21-1',
    topic_id: '21',
    subtopic_id: '21',
    term: 'Anaerobic Fermentation in Yeast',
    definition: 'Glucose → Ethanol + Carbon Dioxide (+ ATP). Used in bread baking (CO2 gas pockets) and alcoholic beverage production.'
  },

  // Chapter 22: Genetic modification
  {
    id: 'fc-22-1',
    topic_id: '22',
    subtopic_id: '22',
    term: 'Recombinant DNA & Plasmids',
    definition: 'DNA constructed by inserting a target gene into a bacterial plasmid vector using restriction enzymes and DNA ligase.'
  }
];

export const INITIAL_NOTES: SubtopicNote[] = [];
export const INITIAL_PAST_PAPERS: PastPaperQuestion[] = [];
