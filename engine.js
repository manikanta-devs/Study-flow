/* ============================================================
   STUDYFLOW — engine.js
   Rule-based logic engine: topic detection + content generation
   No external APIs. Pure JS.
   ============================================================ */

const StudyEngine = (() => {

  /* =========================================================
     TOPIC DETECTION
  ========================================================= */
  const topicKeywords = {
    math: ['solve','equation','algebra','calculus','derivative','integral','matrix','vector','probability','statistics','geometry','triangle','circle','area','volume','perimeter','fraction','percentage','ratio','proportion','prime','factor','logarithm','exponent','quadratic','polynomial','linear','parabola','tangent','sine','cosine','trigonometry','arithmetic','sequence','series','combination','permutation','limit','function','graph','coordinate','slope','intercept','pythagoras','theorem','proof'],
    physics: ['newton','force','velocity','acceleration','momentum','energy','power','work','gravity','friction','mass','weight','pressure','density','wave','frequency','amplitude','light','refraction','reflection','electric','current','voltage','resistance','ohm','magnetic','field','flux','quantum','atom','nucleus','proton','electron','neutron','relativity','thermodynamics','temperature','heat','entropy','motion','kinematics','dynamics','optics','nuclear','circuit','capacitor','inductor','transformer'],
    chemistry: ['atom','molecule','element','compound','mixture','bond','covalent','ionic','reaction','acid','base','salt','ph','oxidation','reduction','redox','periodic','valence','electron','orbital','hybridization','isomer','polymer','organic','inorganic','catalyst','enzyme','equilibrium','concentration','molarity','titration','electrolysis','galvanic','endothermic','exothermic','enthalpy','entropy','gibbs','hydrocarbon','alcohol','ester','amine','carbonyl','benzene','polymer','protein','lipid','carbohydrate'],
    biology: ['cell','nucleus','mitochondria','photosynthesis','respiration','dna','rna','gene','chromosome','protein','enzyme','metabolism','osmosis','diffusion','membrane','tissue','organ','system','evolution','natural selection','mutation','genetics','heredity','ecosystem','food chain','biodiversity','species','adaptation','homeostasis','hormone','neuron','synapse','digestion','circulation','immune','virus','bacteria','fungi','plant','animal','classification'],
    history: ['war','revolution','empire','dynasty','civilization','independence','movement','treaty','colonialism','renaissance','industrial','french revolution','world war','cold war','ancient','medieval','modern','democracy','monarchy','republic','nationalism','imperialism','reformation','enlightenment','discovery','trade','silk road','migration','culture','society','economy','politics','government','constitution','parliament'],
    programming: ['python','java','javascript','c++','code','function','variable','loop','array','list','dictionary','object','class','method','algorithm','data structure','stack','queue','tree','graph','sorting','searching','recursion','dynamic programming','big o','complexity','database','sql','api','web','html','css','react','node','git','debugging','syntax','compiler','interpreter','memory','pointer','recursion','binary','hexadecimal','boolean','conditional','inheritance','polymorphism','encapsulation'],
    geography: ['continent','country','capital','ocean','river','mountain','climate','weather','population','culture','latitude','longitude','ecosystem','biome','tectonic','earthquake','volcano','erosion','deforestation','urbanization','migration','trade','resource','agriculture','industry'],
    economics: ['gdp','inflation','deflation','supply','demand','market','price','cost','profit','loss','trade','export','import','currency','exchange','fiscal','monetary','policy','tax','bank','investment','capital','labor','unemployment','recession','depression','growth','development','poverty','inequality']
  };

  function detectTopic(text) {
    const lower = text.toLowerCase();
    const scores = {};
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      scores[topic] = keywords.filter(k => lower.includes(k)).length;
    }
    const best = Object.entries(scores).sort((a,b) => b[1]-a[1])[0];
    return best[1] > 0 ? best[0] : 'general';
  }

  /* =========================================================
     DOUBT SOLVER TEMPLATES
  ========================================================= */
  const doubtTemplates = {
    math: (q) => {
      const lower = q.toLowerCase();
      // Detect if it's an equation to solve
      if (/solve|find x|find y|\d+x|\d+y|=/.test(lower)) {
        return solveMathEquation(q);
      }
      if (/area|perimeter|volume/.test(lower)) return geometryExplain(q);
      if (/derivative|differentiat/.test(lower)) return calculusExplain(q, 'derivative');
      if (/integral|integrat/.test(lower)) return calculusExplain(q, 'integral');
      if (/probability/.test(lower)) return probabilityExplain(q);
      if (/theorem/.test(lower)) return theoremExplain(q);
      return genericMathExplain(q);
    },
    physics: (q) => {
      const lower = q.toLowerCase();
      if (/newton/.test(lower)) return newtonLaws(q);
      if (/velocity|acceleration|speed|motion/.test(lower)) return kinematicsExplain(q);
      if (/wave|frequency|amplitude/.test(lower)) return waveExplain(q);
      if (/electric|current|circuit|ohm/.test(lower)) return electricityExplain(q);
      if (/gravity|gravitational/.test(lower)) return gravityExplain(q);
      return genericPhysicsExplain(q);
    },
    chemistry: (q) => {
      const lower = q.toLowerCase();
      if (/atom|atomic/.test(lower)) return atomicTheory(q);
      if (/bond|covalent|ionic/.test(lower)) return chemicalBonding(q);
      if (/reaction|product|reactant/.test(lower)) return chemicalReaction(q);
      if (/acid|base|ph/.test(lower)) return acidBaseExplain(q);
      if (/periodic|element/.test(lower)) return periodicTable(q);
      return genericChemExplain(q);
    },
    biology: (q) => {
      const lower = q.toLowerCase();
      if (/photosynthesis/.test(lower)) return photosynthesisExplain(q);
      if (/respiration/.test(lower)) return respirationExplain(q);
      if (/dna|gene|genetic/.test(lower)) return geneticsExplain(q);
      if (/cell/.test(lower)) return cellExplain(q);
      if (/evolution/.test(lower)) return evolutionExplain(q);
      return genericBioExplain(q);
    },
    programming: (q) => {
      const lower = q.toLowerCase();
      if (/for loop|while loop|loop/.test(lower)) return loopExplain(q);
      if (/function|def|method/.test(lower)) return functionExplain(q);
      if (/array|list/.test(lower)) return arrayExplain(q);
      if (/class|object|oop/.test(lower)) return oopExplain(q);
      if (/recursion/.test(lower)) return recursionExplain(q);
      if (/sorting|sort/.test(lower)) return sortingExplain(q);
      return genericProgrammingExplain(q);
    },
    history: (q) => genericHistoryExplain(q),
    general: (q) => genericExplain(q),
    geography: (q) => genericExplain(q),
    economics: (q) => genericExplain(q)
  };

  /* --- MATH TEMPLATES --- */
  function solveMathEquation(q) {
    // Try simple linear equation: ax + b = c
    const match = q.match(/(\d+)\s*[xX]\s*[+\-]?\s*(\d+)?\s*=\s*(\d+)/);
    if (match) {
      const a = parseInt(match[1]);
      const b = match[2] ? parseInt(match[2]) : 0;
      const c = parseInt(match[3]);
      const xVal = (c - b) / a;
      return buildSteps('Mathematics — Linear Equation', 'Algebra', [
        { title: 'Identify the equation', body: `We have: <strong>${match[0]}</strong>` },
        { title: 'Isolate the variable', body: `Move constant to right side: <strong>${a}x = ${c} - ${b} = ${c-b}</strong>` },
        { title: 'Divide both sides', body: `Divide by coefficient: <strong>x = ${c-b} ÷ ${a}</strong>` },
        { title: 'Verify', body: `Substitute back: ${a}(${xVal}) + ${b} = ${a*xVal + b} ✓` }
      ], `<strong>x = ${xVal}</strong>`, 'math');
    }
    return genericMathExplain(q);
  }

  function geometryExplain(q) {
    const lower = q.toLowerCase();
    let steps = [];
    if (/area.*circle/.test(lower)) {
      steps = [
        { title: 'Formula', body: 'Area of a circle = <code>π × r²</code>' },
        { title: 'Variables', body: '<strong>π</strong> ≈ 3.14159, <strong>r</strong> = radius of the circle' },
        { title: 'Steps', body: '1. Measure/identify the radius r<br>2. Square it: r²<br>3. Multiply by π' },
        { title: 'Example', body: 'If r = 5 cm → Area = π × 25 = <strong>78.54 cm²</strong>' }
      ];
      return buildSteps('Mathematics — Geometry', 'Area of Circle', steps, 'A = πr²', 'math');
    }
    if (/area.*triangle/.test(lower)) {
      steps = [
        { title: 'Formula', body: 'Area of a triangle = <code>(1/2) × base × height</code>' },
        { title: 'Variables', body: '<strong>base (b)</strong> = bottom side, <strong>height (h)</strong> = perpendicular height' },
        { title: 'Steps', body: '1. Identify base and height<br>2. Multiply base × height<br>3. Divide by 2' },
        { title: 'Example', body: 'If b = 6 cm, h = 4 cm → Area = (1/2) × 6 × 4 = <strong>12 cm²</strong>' }
      ];
      return buildSteps('Mathematics — Geometry', 'Area of Triangle', steps, 'A = ½bh', 'math');
    }
    return genericMathExplain(q);
  }

  function calculusExplain(q, type) {
    if (type === 'derivative') {
      return buildSteps('Mathematics — Calculus', 'Differentiation', [
        { title: 'What is a Derivative?', body: 'A derivative measures the <strong>rate of change</strong> of a function. It tells how fast y changes as x changes.' },
        { title: 'Power Rule', body: 'If f(x) = xⁿ, then <strong>f\'(x) = n·xⁿ⁻¹</strong>' },
        { title: 'Common Rules', body: '• Constant: d/dx(c) = 0<br>• Power: d/dx(xⁿ) = nxⁿ⁻¹<br>• Sum: d/dx(f+g) = f\'+g\'<br>• Product: d/dx(fg) = f\'g + fg\'' },
        { title: 'Example', body: 'f(x) = 3x² + 5x + 2<br>f\'(x) = 6x + 5<br><em>(derivative of constant = 0)</em>' }
      ], 'f\'(x) = lim[h→0] (f(x+h) - f(x)) / h', 'math');
    }
    return buildSteps('Mathematics — Calculus', 'Integration', [
      { title: 'What is an Integral?', body: 'Integration finds the <strong>area under a curve</strong>. It is the reverse of differentiation.' },
      { title: 'Power Rule for Integration', body: 'If f(x) = xⁿ, then <strong>∫xⁿ dx = xⁿ⁺¹/(n+1) + C</strong>' },
      { title: 'Types', body: '• <strong>Indefinite:</strong> ∫f(x)dx = F(x) + C<br>• <strong>Definite:</strong> ∫[a→b] f(x)dx = F(b) - F(a)' },
      { title: 'Example', body: '∫(3x² + 2x) dx = x³ + x² + C' }
    ], '∫f(x)dx = F(x) + C', 'math');
  }

  function theoremExplain(q) {
    const lower = q.toLowerCase();
    if (/pythagoras/.test(lower)) {
      return buildSteps('Mathematics — Geometry', 'Pythagorean Theorem', [
        { title: 'Statement', body: 'In a right-angled triangle: <strong>a² + b² = c²</strong>' },
        { title: 'Variables', body: '<strong>a, b</strong> = legs (shorter sides), <strong>c</strong> = hypotenuse (longest side, opposite to right angle)' },
        { title: 'Application', body: 'Given legs a=3, b=4: c² = 9 + 16 = 25 → <strong>c = 5</strong>' },
        { title: 'Verification', body: '3² + 4² = 9 + 16 = 25 = 5² ✓' },
        { title: 'Uses', body: 'Finding distances, construction, navigation, physics problems' }
      ], 'c = √(a² + b²)', 'math');
    }
    return genericMathExplain(q);
  }

  function probabilityExplain(q) {
    return buildSteps('Mathematics — Probability', 'Probability Theory', [
      { title: 'Definition', body: 'Probability = number of favorable outcomes ÷ total outcomes' },
      { title: 'Formula', body: '<code>P(E) = n(E) / n(S)</code><br>n(E) = favorable outcomes, n(S) = sample space' },
      { title: 'Properties', body: '• 0 ≤ P(E) ≤ 1<br>• P(impossible) = 0<br>• P(certain) = 1<br>• P(A) + P(A\') = 1' },
      { title: 'Example', body: 'Rolling a die: P(getting 3) = 1/6 ≈ <strong>0.167 or 16.7%</strong>' }
    ], 'P(E) = Favourable Outcomes / Total Outcomes', 'math');
  }

  function genericMathExplain(q) {
    return buildSteps('Mathematics', 'Mathematical Concept', [
      { title: 'Understanding the Problem', body: `Analyzing: <em>"${q}"</em>` },
      { title: 'Core Concept', body: 'Mathematics uses logical reasoning and symbolic notation to solve problems systematically.' },
      { title: 'General Approach', body: '1. <strong>Read</strong> the problem carefully<br>2. <strong>Identify</strong> known and unknown values<br>3. <strong>Choose</strong> the right formula or method<br>4. <strong>Solve</strong> step by step<br>5. <strong>Verify</strong> your answer' },
      { title: 'Key Tip', body: 'Always write down every step. A systematic approach prevents errors and helps identify mistakes quickly.' }
    ], 'Break every problem into smaller, manageable steps.', 'math');
  }

  /* --- PHYSICS TEMPLATES --- */
  function newtonLaws(q) {
    return buildSteps('Physics — Classical Mechanics', 'Newton\'s Laws of Motion', [
      { title: 'First Law (Law of Inertia)', body: 'An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an <strong>external force</strong>. Example: A ball rolling on a frictionless surface.' },
      { title: 'Second Law (F = ma)', body: 'Force equals mass times acceleration: <strong>F = ma</strong>. A heavier object requires more force to accelerate. Units: Newtons (N) = kg·m/s²' },
      { title: 'Third Law (Action-Reaction)', body: 'For every action, there is an <strong>equal and opposite reaction</strong>. Example: Rocket propulsion — exhaust pushes down, rocket moves up.' },
      { title: 'Application', body: 'These laws explain virtually all everyday motion: walking, driving, falling, throwing objects.' }
    ], 'F = ma (Newton\'s Second Law)', 'physics');
  }

  function kinematicsExplain(q) {
    return buildSteps('Physics — Kinematics', 'Equations of Motion', [
      { title: 'Key Variables', body: '<strong>u</strong> = initial velocity, <strong>v</strong> = final velocity, <strong>a</strong> = acceleration, <strong>t</strong> = time, <strong>s</strong> = displacement' },
      { title: 'The Four Equations', body: '1. v = u + at<br>2. s = ut + ½at²<br>3. v² = u² + 2as<br>4. s = (u+v)t / 2' },
      { title: 'How to Apply', body: '1. List the known values<br>2. Identify what you need to find<br>3. Pick the equation with those variables<br>4. Substitute and solve' },
      { title: 'Example', body: 'u=0, a=9.8 m/s², t=3s → v = 0 + 9.8×3 = <strong>29.4 m/s</strong>' }
    ], 'Choose the right kinematic equation based on known variables.', 'physics');
  }

  function waveExplain(q) {
    return buildSteps('Physics — Waves', 'Wave Properties', [
      { title: 'What is a Wave?', body: 'A wave is a disturbance that transfers <strong>energy</strong> through a medium without transferring matter.' },
      { title: 'Key Properties', body: '<strong>Amplitude (A):</strong> Maximum displacement<br><strong>Wavelength (λ):</strong> Distance between crests<br><strong>Frequency (f):</strong> Waves per second (Hz)<br><strong>Period (T):</strong> Time per wave = 1/f' },
      { title: 'Wave Equation', body: '<strong>v = fλ</strong><br>wave speed = frequency × wavelength' },
      { title: 'Types of Waves', body: '<strong>Transverse:</strong> Vibration ⊥ direction (light, water)<br><strong>Longitudinal:</strong> Vibration ∥ direction (sound)' }
    ], 'v = fλ (Wave speed = frequency × wavelength)', 'physics');
  }

  function electricityExplain(q) {
    return buildSteps('Physics — Electricity', 'Electric Circuits & Ohm\'s Law', [
      { title: 'Ohm\'s Law', body: 'Voltage = Current × Resistance: <strong>V = IR</strong>' },
      { title: 'Key Quantities', body: '<strong>V</strong> = Voltage (Volts)<br><strong>I</strong> = Current (Amperes / Amps)<br><strong>R</strong> = Resistance (Ohms Ω)' },
      { title: 'Series vs Parallel', body: '<strong>Series:</strong> R_total = R₁ + R₂ + ...<br><strong>Parallel:</strong> 1/R_total = 1/R₁ + 1/R₂ + ...' },
      { title: 'Power', body: 'Power = VI = I²R = V²/R (units: Watts W)' }
    ], 'V = IR (Ohm\'s Law)', 'physics');
  }

  function gravityExplain(q) {
    return buildSteps('Physics — Gravitation', 'Gravity & Gravitational Force', [
      { title: 'Newton\'s Law of Gravitation', body: 'Every mass attracts every other mass: <strong>F = Gm₁m₂/r²</strong>' },
      { title: 'Constants & Variables', body: '<strong>G</strong> = 6.674×10⁻¹¹ N·m²/kg² (gravitational constant)<br><strong>m₁, m₂</strong> = masses, <strong>r</strong> = distance between them' },
      { title: 'Acceleration due to Gravity', body: 'On Earth\'s surface: <strong>g = 9.8 m/s²</strong><br>Weight = mg' },
      { title: 'Escape Velocity', body: 'v_escape = √(2GM/R) ≈ 11.2 km/s for Earth' }
    ], 'F = Gm₁m₂/r² (Universal Gravitation)', 'physics');
  }

  function genericPhysicsExplain(q) {
    return buildSteps('Physics', 'Physical Concept', [
      { title: 'Understanding', body: `Analyzing: <em>"${q}"</em>` },
      { title: 'Physics Approach', body: 'Physics explains natural phenomena through observation, experimentation, and mathematical modeling.' },
      { title: 'Problem-Solving Method', body: '1. <strong>Draw</strong> a diagram if possible<br>2. <strong>List</strong> given values with units<br>3. <strong>Identify</strong> the relevant law/formula<br>4. <strong>Solve</strong> mathematically<br>5. Check units in the answer' },
      { title: 'Key Tip', body: 'Always include units. A number without a unit is meaningless in physics.' }
    ], 'Physics = Observation + Mathematics + Logic', 'physics');
  }

  /* --- CHEMISTRY TEMPLATES --- */
  function atomicTheory(q) {
    return buildSteps('Chemistry — Atomic Structure', 'Atomic Theory & Structure', [
      { title: 'Modern Atomic Model', body: 'An atom consists of a central <strong>nucleus</strong> (protons + neutrons) surrounded by <strong>electrons</strong> in orbitals.' },
      { title: 'Subatomic Particles', body: '<strong>Proton:</strong> +1 charge, in nucleus<br><strong>Neutron:</strong> neutral, in nucleus<br><strong>Electron:</strong> -1 charge, orbits nucleus' },
      { title: 'Atomic Numbers', body: '<strong>Atomic Number (Z):</strong> number of protons<br><strong>Mass Number (A):</strong> protons + neutrons<br><strong>Neutrons:</strong> A - Z' },
      { title: 'Electron Configuration', body: 'Shells fill in order: 1s, 2s, 2p, 3s, 3p... Aufbau principle.' }
    ], 'Atomic Number = Protons = Electrons (neutral atom)', 'chemistry');
  }

  function chemicalBonding(q) {
    return buildSteps('Chemistry — Chemical Bonding', 'Types of Chemical Bonds', [
      { title: 'Ionic Bond', body: '<strong>Electron transfer</strong> between metals and non-metals. Creates ions with opposite charges that attract. Example: NaCl (table salt)' },
      { title: 'Covalent Bond', body: '<strong>Electron sharing</strong> between non-metals. Can be single (2e shared), double (4e), or triple (6e). Example: H₂O, CO₂' },
      { title: 'Metallic Bond', body: 'Metal atoms share a "<strong>sea of electrons</strong>". Explains electrical conductivity and malleability of metals.' },
      { title: 'Bond Strength', body: 'Triple > Double > Single<br>Ionic bonds are very strong in solid state.' }
    ], 'Bonding = how atoms connect by sharing or transferring electrons.', 'chemistry');
  }

  function chemicalReaction(q) {
    return buildSteps('Chemistry — Reactions', 'Chemical Reactions', [
      { title: 'What is a Chemical Reaction?', body: 'A process where <strong>reactants</strong> are converted into <strong>products</strong> with new properties.' },
      { title: 'Types of Reactions', body: '• <strong>Combination:</strong> A + B → AB<br>• <strong>Decomposition:</strong> AB → A + B<br>• <strong>Displacement:</strong> A + BC → AC + B<br>• <strong>Redox:</strong> electron transfer reactions' },
      { title: 'Balancing Equations', body: '1. Count atoms on each side<br>2. Add coefficients to balance<br>3. Law of Conservation of Mass must be satisfied' },
      { title: 'Example', body: 'H₂ + O₂ → H₂O (unbalanced)<br>2H₂ + O₂ → 2H₂O (balanced ✓)' }
    ], 'Law of Conservation of Mass: atoms are never created or destroyed.', 'chemistry');
  }

  function acidBaseExplain(q) {
    return buildSteps('Chemistry — Acid-Base Chemistry', 'Acids, Bases & pH', [
      { title: 'Definitions', body: '<strong>Arrhenius:</strong> Acid releases H⁺, Base releases OH⁻<br><strong>Brønsted-Lowry:</strong> Acid = H⁺ donor, Base = H⁺ acceptor' },
      { title: 'pH Scale', body: 'pH = -log[H⁺]<br>pH < 7 → Acidic | pH = 7 → Neutral | pH > 7 → Basic' },
      { title: 'Common Examples', body: '<strong>Acids:</strong> HCl (pH≈1), lemon juice (pH≈2), vinegar (pH≈3)<br><strong>Bases:</strong> NaOH (pH≈14), bleach (pH≈13), baking soda (pH≈9)' },
      { title: 'Neutralization', body: 'Acid + Base → Salt + Water<br>HCl + NaOH → NaCl + H₂O' }
    ], 'pH = -log[H⁺]', 'chemistry');
  }

  function periodicTable(q) {
    return buildSteps('Chemistry — Periodic Table', 'The Periodic Table', [
      { title: 'Organization', body: 'Elements are arranged by <strong>increasing atomic number</strong> in rows (periods) and columns (groups).' },
      { title: 'Groups (Columns)', body: 'Group 1: Alkali metals | Group 17: Halogens | Group 18: Noble gases | Groups 3-12: Transition metals' },
      { title: 'Trends', body: '<strong>Atomic radius:</strong> ↓ group (increases), → period (decreases)<br><strong>Electronegativity:</strong> ↑ right, ↑ top<br><strong>Ionization energy:</strong> ↑ right, ↑ top' },
      { title: 'Memory Tip', body: 'First 20 elements: H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca' }
    ], 'The periodic table organizes all known elements by atomic number and properties.', 'chemistry');
  }

  function genericChemExplain(q) {
    return buildSteps('Chemistry', 'Chemical Concept', [
      { title: 'Understanding', body: `Analyzing: <em>"${q}"</em>` },
      { title: 'Chemistry Fundamentals', body: 'Chemistry studies matter — its composition, structure, properties, and the changes it undergoes.' },
      { title: 'Study Approach', body: '1. <strong>Learn</strong> the relevant theory and definitions<br>2. <strong>Understand</strong> the molecular/atomic level changes<br>3. <strong>Practice</strong> balancing equations<br>4. <strong>Memorize</strong> key formulas and trends' }
    ], 'Chemistry: The study of matter and its transformations.', 'chemistry');
  }

  /* --- BIOLOGY TEMPLATES --- */
  function photosynthesisExplain(q) {
    return buildSteps('Biology — Plant Biology', 'Photosynthesis', [
      { title: 'Definition', body: 'Photosynthesis is the process by which plants convert <strong>light energy</strong> into <strong>chemical energy</strong> (glucose).' },
      { title: 'Overall Equation', body: '<code>6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂</code>' },
      { title: 'Where it Happens', body: 'In the <strong>chloroplast</strong>, specifically:<br>• <strong>Thylakoid</strong>: Light reactions (captures light, produces ATP)<br>• <strong>Stroma</strong>: Dark reactions / Calvin cycle (fixes CO₂ into glucose)' },
      { title: 'Two Stages', body: '<strong>Light Reactions:</strong> Water splits, O₂ released, ATP + NADPH formed<br><strong>Calvin Cycle:</strong> CO₂ fixed using ATP+NADPH → glucose' },
      { title: 'Importance', body: 'Produces oxygen for all aerobic life. Basis of all food chains. Reduces CO₂ from atmosphere.' }
    ], '6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂', 'biology');
  }

  function respirationExplain(q) {
    return buildSteps('Biology — Cell Biology', 'Cellular Respiration', [
      { title: 'Definition', body: 'The process by which cells break down <strong>glucose</strong> to release energy (ATP).' },
      { title: 'Overall Equation', body: '<code>C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (energy)</code>' },
      { title: 'Three Stages', body: '<strong>1. Glycolysis</strong> (cytoplasm): Glucose → 2 Pyruvate, 2 ATP<br><strong>2. Krebs Cycle</strong> (mitochondria): Pyruvate → CO₂, NADH<br><strong>3. Electron Transport Chain</strong>: NADH → ~32 ATP' },
      { title: 'Anaerobic vs Aerobic', body: '<strong>Aerobic:</strong> With O₂, ~36 ATP produced<br><strong>Anaerobic:</strong> Without O₂, only 2 ATP, produces lactic acid/ethanol' }
    ], 'Aerobic Respiration produces ~36-38 ATP per glucose molecule.', 'biology');
  }

  function geneticsExplain(q) {
    return buildSteps('Biology — Genetics', 'DNA, Genes & Heredity', [
      { title: 'DNA Structure', body: 'DNA is a <strong>double helix</strong> made of nucleotides (sugar + phosphate + base). Bases: A-T, G-C (complementary pairing).' },
      { title: 'Gene', body: 'A segment of DNA that codes for a specific <strong>protein</strong>. Humans have ~20,000-25,000 genes.' },
      { title: 'Central Dogma', body: '<strong>DNA → RNA → Protein</strong><br>Transcription (DNA→mRNA) → Translation (mRNA→protein)' },
      { title: 'Mendelian Genetics', body: '<strong>Dominant (A):</strong> Expressed when present<br><strong>Recessive (a):</strong> Only expressed when homozygous (aa)<br>Genotype: genetic makeup | Phenotype: expressed trait' }
    ], 'Central Dogma: DNA → mRNA → Protein', 'biology');
  }

  function cellExplain(q) {
    return buildSteps('Biology — Cell Biology', 'Cell Structure & Function', [
      { title: 'Cell Theory', body: '1. All living things are made of cells<br>2. Cell is the basic unit of life<br>3. Cells come from pre-existing cells' },
      { title: 'Prokaryotic vs Eukaryotic', body: '<strong>Prokaryotic:</strong> No nucleus, simpler (bacteria)<br><strong>Eukaryotic:</strong> Has nucleus, complex (plants, animals, fungi)' },
      { title: 'Key Organelles', body: '<strong>Nucleus:</strong> Contains DNA, control center<br><strong>Mitochondria:</strong> ATP production (powerhouse)<br><strong>Ribosome:</strong> Protein synthesis<br><strong>Cell membrane:</strong> Controls entry/exit' },
      { title: 'Plant vs Animal Cells', body: '<strong>Plant only:</strong> Cell wall, chloroplasts, large vacuole<br><strong>Animal only:</strong> Centrioles, lysosomes' }
    ], 'Mitochondria = Powerhouse of the cell (ATP production)', 'biology');
  }

  function evolutionExplain(q) {
    return buildSteps('Biology — Evolution', 'Evolution & Natural Selection', [
      { title: 'Darwin\'s Theory', body: 'Species change over time through <strong>natural selection</strong> — organisms with favorable traits survive and reproduce more.' },
      { title: 'Key Mechanisms', body: '<strong>Variation:</strong> Individuals differ<br><strong>Inheritance:</strong> Traits passed to offspring<br><strong>Selection:</strong> Favorable traits increase in frequency<br><strong>Time:</strong> Changes accumulate over generations' },
      { title: 'Evidence', body: 'Fossil record, comparative anatomy, DNA similarity, observed speciation, biogeography' },
      { title: 'Types of Selection', body: '<strong>Natural:</strong> Environment selects<br><strong>Sexual:</strong> Mates select<br><strong>Artificial:</strong> Humans select (breeding)' }
    ], 'Survival of the fittest = Reproduction of the best-adapted.', 'biology');
  }

  function genericBioExplain(q) {
    return buildSteps('Biology', 'Biological Concept', [
      { title: 'Understanding', body: `Analyzing: <em>"${q}"</em>` },
      { title: 'Biology Fundamentals', body: 'Biology is the study of life — from molecules and cells to organisms and ecosystems.' },
      { title: 'Study Approach', body: '1. <strong>Understand</strong> the concept at molecular level<br>2. <strong>Connect</strong> to larger biological systems<br>3. <strong>Use</strong> diagrams to visualize structures<br>4. <strong>Remember</strong> key terms and definitions' }
    ], 'Biology: The science of life and living organisms.', 'biology');
  }

  /* --- PROGRAMMING TEMPLATES --- */
  function loopExplain(q) {
    const lower = q.toLowerCase();
    const lang = lower.includes('java') && !lower.includes('javascript') ? 'java' : lower.includes('c++') ? 'cpp' : 'python';
    const examples = {
      python: `for i in range(5):\n    print(i)  # prints 0,1,2,3,4\n\n# While loop\nn = 0\nwhile n < 5:\n    print(n)\n    n += 1`,
      java: `for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}\n\n// While loop\nint n = 0;\nwhile (n < 5) {\n    System.out.println(n++);\n}`,
      cpp: `for (int i = 0; i < 5; i++) {\n    cout << i << endl;\n}\n\n// While loop\nint n = 0;\nwhile (n < 5) cout << n++ << endl;`
    };
    return buildSteps('Programming — Control Flow', 'Loops', [
      { title: 'What is a Loop?', body: 'A loop <strong>repeats a block of code</strong> multiple times, avoiding repetition. Used when you need to do something many times.' },
      { title: 'For Loop', body: 'Used when you know <strong>how many times</strong> to repeat. Has: initialization, condition, update.' },
      { title: 'While Loop', body: 'Used when you repeat <strong>until a condition</strong> becomes false. Check condition before each iteration.' },
      { title: 'Code Example', body: `<pre><code>${examples[lang]}</code></pre>` },
      { title: 'When to Use', body: 'For loop: iterating lists, known count<br>While loop: waiting for user input, unknown iterations' }
    ], 'Loops avoid repetition by executing code multiple times automatically.', 'programming');
  }

  function functionExplain(q) {
    return buildSteps('Programming — Functions', 'Functions & Methods', [
      { title: 'What is a Function?', body: 'A function is a <strong>reusable block of code</strong> that performs a specific task. It takes inputs (parameters) and returns an output.' },
      { title: 'Why Use Functions?', body: '• <strong>Reusability:</strong> Write once, use many times<br>• <strong>Organization:</strong> Break large problems into small pieces<br>• <strong>Readability:</strong> Named functions explain intent' },
      { title: 'Python Example', body: '<pre><code>def greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("Student")\nprint(result)  # Hello, Student!</code></pre>' },
      { title: 'Key Concepts', body: '<strong>Parameters:</strong> Variables in function definition<br><strong>Arguments:</strong> Actual values passed<br><strong>Return:</strong> Value the function gives back' }
    ], 'Functions = reusable, named blocks of code that take inputs and return outputs.', 'programming');
  }

  function arrayExplain(q) {
    return buildSteps('Programming — Data Structures', 'Arrays & Lists', [
      { title: 'What is an Array?', body: 'An array is an <strong>ordered collection</strong> of elements stored at contiguous memory locations, accessed by index (starting at 0).' },
      { title: 'Python List Example', body: '<pre><code>fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])  # apple\nfruits.append("mango")  # add\nfruits.remove("banana")  # remove</code></pre>' },
      { title: 'Key Operations', body: '<strong>Access:</strong> O(1) — instant by index<br><strong>Search:</strong> O(n) — must check each<br><strong>Insert/Delete:</strong> O(n) — must shift elements' },
      { title: 'Useful Methods', body: 'append(), pop(), sort(), reverse(), len(), index(), slice [a:b]' }
    ], 'Arrays store ordered data; access by index starts at 0.', 'programming');
  }

  function oopExplain(q) {
    return buildSteps('Programming — OOP', 'Object-Oriented Programming', [
      { title: '4 Pillars of OOP', body: '<strong>Encapsulation:</strong> Bundling data + methods<br><strong>Inheritance:</strong> Child class inherits from parent<br><strong>Polymorphism:</strong> Same method, different behavior<br><strong>Abstraction:</strong> Hiding complexity' },
      { title: 'Class & Object', body: '<strong>Class:</strong> Blueprint (template)<br><strong>Object:</strong> Instance of a class' },
      { title: 'Python Example', body: '<pre><code>class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} says Woof!"\n\ndog = Dog("Rex")\nprint(dog.speak())</code></pre>' }
    ], 'OOP: Model real-world entities as objects with properties and behaviors.', 'programming');
  }

  function recursionExplain(q) {
    return buildSteps('Programming — Algorithms', 'Recursion', [
      { title: 'What is Recursion?', body: 'A function that <strong>calls itself</strong> to solve smaller versions of the same problem.' },
      { title: 'Two Requirements', body: '<strong>1. Base Case:</strong> Stopping condition (prevents infinite loop)<br><strong>2. Recursive Case:</strong> Function calls itself with smaller input' },
      { title: 'Example: Factorial', body: '<pre><code>def factorial(n):\n    if n == 0:  # Base case\n        return 1\n    return n * factorial(n-1)  # Recursive\n\nprint(factorial(5))  # 120</code></pre>' },
      { title: 'When to Use', body: 'Tree traversal, sorting (merge sort), combinatorics, divide-and-conquer problems' }
    ], 'Recursion: A function calling itself with a smaller input until the base case.', 'programming');
  }

  function sortingExplain(q) {
    return buildSteps('Programming — Algorithms', 'Sorting Algorithms', [
      { title: 'Bubble Sort', body: 'Repeatedly swap adjacent elements if out of order. Simple but slow.<br><strong>O(n²)</strong> time complexity' },
      { title: 'Selection Sort', body: 'Find minimum, place at beginning. Repeat for remaining.<br><strong>O(n²)</strong> time complexity' },
      { title: 'Merge Sort', body: 'Divide array in half, sort each half, merge them.<br><strong>O(n log n)</strong> — much faster!' },
      { title: 'Quick Sort', body: 'Pick a pivot, partition array around it, recurse.<br><strong>O(n log n)</strong> average — very practical' },
      { title: 'Python Built-in', body: '<pre><code>arr = [3,1,4,1,5,9]\narr.sort()        # in-place\nsorted_arr = sorted(arr)  # returns new list</code></pre>' }
    ], 'Best practical sorting algorithms: Merge Sort and Quick Sort at O(n log n).', 'programming');
  }

  function genericProgrammingExplain(q) {
    return buildSteps('Programming', 'Programming Concept', [
      { title: 'Understanding', body: `Analyzing: <em>"${q}"</em>` },
      { title: 'Programming Fundamentals', body: 'Programming is giving instructions to a computer using a language it understands.' },
      { title: 'General Approach', body: '1. <strong>Understand</strong> the problem<br>2. <strong>Plan</strong> your algorithm (pseudocode)<br>3. <strong>Code</strong> step by step<br>4. <strong>Test</strong> with different inputs<br>5. <strong>Debug</strong> and optimize' }
    ], 'Good code = clarity + correctness + efficiency.', 'programming');
  }

  /* --- HISTORY / GENERAL --- */
  function genericHistoryExplain(q) {
    return buildSteps('History', 'Historical Event/Concept', [
      { title: 'Topic', body: `<em>"${q}"</em>` },
      { title: 'Historical Context', body: 'Understanding history requires examining the <strong>causes</strong>, <strong>events</strong>, and <strong>consequences</strong> of each occurrence.' },
      { title: 'Analysis Framework', body: '<strong>Who:</strong> Key figures involved<br><strong>What:</strong> Events that occurred<br><strong>When:</strong> Timeline and period<br><strong>Where:</strong> Geographic context<br><strong>Why:</strong> Root causes<br><strong>How:</strong> Mechanism of change' },
      { title: 'Impact', body: 'Consider short-term effects (immediate aftermath) and long-term consequences (how it shaped the future).' }
    ], 'History = Causes → Events → Consequences', 'history');
  }

  function genericExplain(q) {
    return buildSteps('General Studies', 'Concept Explanation', [
      { title: 'Your Question', body: `<em>"${q}"</em>` },
      { title: 'Understanding Approach', body: 'Breaking complex topics into simple, digestible parts is the key to learning anything.' },
      { title: 'Study Framework', body: '1. <strong>Define</strong> the core concept in simple words<br>2. <strong>Identify</strong> key components/parts<br>3. <strong>Find</strong> examples in real life<br>4. <strong>Connect</strong> to things you already know<br>5. <strong>Test</strong> yourself by explaining it to someone else' },
      { title: 'Remember', body: 'The Feynman Technique: If you can\'t explain it simply, you don\'t understand it well enough.' }
    ], 'The best way to learn: Explain it in your own words.', 'general');
  }

  /* --- STEP BUILDER --- */
  function buildSteps(subject, concept, steps, answer, topicType) {
    const colors = { math: '#5b4eff', physics: '#ff4d6d', chemistry: '#06d6a0', biology: '#b5ff4d', programming: '#ffd166', history: '#f4a261', general: '#8b8fb5' };
    const color = colors[topicType] || colors.general;
    let html = `
      <div class="tag-row">
        <span class="tag tag-subject">${subject}</span>
        <span class="tag tag-concept">${concept}</span>
      </div>
    `;
    steps.forEach((step, i) => {
      html += `
        <div class="step-block">
          <div class="step-num">${i+1}</div>
          <div class="step-content">
            <strong>${step.title}</strong>
            <p>${step.body}</p>
          </div>
        </div>
      `;
    });
    html += `
      <div style="background:rgba(91,78,255,0.08);border:1.5px solid rgba(91,78,255,0.2);border-radius:8px;padding:0.9rem 1.1rem;margin-top:1rem;">
        <p style="font-size:0.78rem;color:var(--text-faint);margin-bottom:0.3rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Final Answer / Key Formula</p>
        <p style="color:var(--text);font-weight:600;font-size:1rem;">${answer}</p>
      </div>
    `;
    return html;
  }

  /* =========================================================
     ASSIGNMENT GENERATOR
  ========================================================= */
  function generateAssignment(topic, subject, difficulty, wordLimit, type) {
    const templates = { essay: essayTemplate, report: reportTemplate, qa: qaTemplate, project: projectTemplate };
    return (templates[type] || essayTemplate)(topic, subject, difficulty, parseInt(wordLimit));
  }

  function essayTemplate(topic, subject, difficulty, words) {
    const levelLabels = { beginner: 'Introductory', intermediate: 'Standard', advanced: 'Higher Secondary', university: 'Undergraduate' };
    const level = levelLabels[difficulty] || 'Standard';
    return `
      <div class="tag-row">
        <span class="tag tag-subject">${subject}</span>
        <span class="tag tag-difficulty">${level} Level · ~${words} words · Essay</span>
      </div>
      <h2 style="margin-top:0">${topic}: A Comprehensive Analysis</h2>
      <p style="color:var(--text-faint);font-size:0.8rem;margin-bottom:1.25rem">Subject: ${subject.charAt(0).toUpperCase()+subject.slice(1)} | Type: Essay | Level: ${level}</p>

      <h3>Introduction</h3>
      <p>The concept of <strong>${topic}</strong> stands as one of the most significant and widely discussed subjects in the field of ${subject}. Understanding ${topic} requires not only a grasp of its fundamental principles but also an appreciation of its broader implications in both academic and real-world contexts. This essay aims to explore the multifaceted nature of ${topic}, examining its key dimensions, underlying mechanisms, and lasting significance.</p>
      <p>The study of ${topic} has evolved considerably over time, shaped by advances in knowledge, changing perspectives, and practical discoveries. Today, it remains a topic of considerable academic interest and practical relevance, informing policy decisions, educational curricula, and professional practices across many domains.</p>

      <h3>Background & Context</h3>
      <p>To fully appreciate ${topic}, it is essential to consider its historical and conceptual background. The origins of ${topic} can be traced to a rich tradition of inquiry and observation. Early scholars and practitioners recognized its importance, contributing foundational insights that continue to shape our understanding. Over the decades, theoretical frameworks have been developed and refined, offering increasingly nuanced explanations of the phenomena associated with ${topic}.</p>
      <p>Within the broader context of ${subject}, ${topic} occupies a central position. Its principles are intertwined with other key concepts and disciplines, making it a cornerstone of both theoretical study and applied practice. Understanding this context is vital for any serious student of the subject.</p>

      <h3>Key Concepts & Analysis</h3>
      <ul>
        <li><strong>Definition & Scope:</strong> At its core, ${topic} refers to a set of ideas, processes, or phenomena that are characterized by their complexity, interdependence, and significance within ${subject}.</li>
        <li><strong>Core Principles:</strong> The study of ${topic} rests on a number of foundational principles, including careful observation, systematic analysis, critical evaluation, and application of established theories.</li>
        <li><strong>Mechanisms & Processes:</strong> The mechanisms underlying ${topic} are both intricate and fascinating. They involve interactions between multiple variables, each of which contributes to the overall pattern of behavior or outcomes observed.</li>
        <li><strong>Real-World Applications:</strong> The insights derived from studying ${topic} have numerous practical applications, ranging from improvements in professional practice to the development of new technologies and approaches.</li>
        <li><strong>Challenges & Limitations:</strong> Despite its importance, the study of ${topic} is not without challenges. Researchers and practitioners must navigate issues of complexity, uncertainty, and the ever-changing nature of knowledge in the field.</li>
      </ul>

      <h3>Discussion</h3>
      <p>A deeper examination of ${topic} reveals both its strengths and its areas of ongoing debate. While there is broad consensus on many of its fundamental aspects, scholars and experts continue to explore its finer nuances and implications. This ongoing discourse is a testament to the richness and vitality of the subject.</p>
      <p>Comparative analysis shows that different approaches to ${topic} yield varying results, underscoring the importance of context, methodology, and perspective. Students and professionals alike are encouraged to engage critically with the material, drawing on multiple sources and viewpoints to form well-rounded, evidence-based conclusions.</p>

      <h3>Conclusion</h3>
      <p>In conclusion, ${topic} represents a subject of enduring importance within ${subject}. Its study offers valuable insights into the workings of the world, the nature of knowledge, and the challenges of applying theory to practice. By engaging thoughtfully with the key concepts and debates surrounding ${topic}, students can develop a deeper appreciation of the subject and enhance their capacity for critical, analytical thinking.</p>
      <p>The lessons derived from studying ${topic} extend beyond the classroom, informing professional practice, policy-making, and everyday decision-making. As our understanding continues to evolve, so too will the significance of ${topic} in shaping the future of ${subject} and beyond.</p>

      <h3>References</h3>
      <ul>
        <li>Standard textbooks and academic journals on ${subject}</li>
        <li>Relevant case studies and empirical research on ${topic}</li>
        <li>Peer-reviewed articles and review papers (latest editions)</li>
        <li>Authoritative online resources and databases</li>
      </ul>
    `;
  }

  function reportTemplate(topic, subject, difficulty, words) {
    return `
      <div class="tag-row">
        <span class="tag tag-subject">${subject}</span>
        <span class="tag tag-difficulty">~${words} words · Report</span>
      </div>
      <h2 style="margin-top:0">Report on: ${topic}</h2>
      <p style="color:var(--text-faint);font-size:0.8rem;margin-bottom:1.25rem">Subject: ${subject} | Format: Formal Report</p>

      <h3>Executive Summary</h3>
      <p>This report provides a structured analysis of <strong>${topic}</strong>. The report covers background context, key findings, critical observations, and actionable recommendations based on a systematic examination of available information.</p>

      <h3>1. Introduction</h3>
      <p>This report was prepared to provide a comprehensive overview of ${topic} within the context of ${subject}. The scope of this report includes the definition and background of the topic, key concepts and principles, relevant data and observations, and conclusions with recommendations.</p>

      <h3>2. Background</h3>
      <p>${topic} has been an area of significant interest and study. Its importance stems from its wide-ranging implications and applications in both theoretical and practical contexts within ${subject}. Understanding the foundational elements of ${topic} is essential for informed analysis and decision-making.</p>

      <h3>3. Key Findings</h3>
      <ul>
        <li><strong>Finding 1:</strong> ${topic} demonstrates clear patterns and principles that are consistent across various contexts and applications.</li>
        <li><strong>Finding 2:</strong> Empirical evidence supports the significance of ${topic} in driving outcomes within ${subject}.</li>
        <li><strong>Finding 3:</strong> There are identifiable factors — both internal and external — that influence the behavior and outcomes associated with ${topic}.</li>
        <li><strong>Finding 4:</strong> Current best practices in ${subject} incorporate insights from the study of ${topic} to achieve better results.</li>
      </ul>

      <h3>4. Analysis</h3>
      <p>The analysis of ${topic} reveals several important dimensions. First, the theoretical framework provides a robust foundation for understanding the mechanisms involved. Second, practical applications demonstrate the real-world relevance of these insights. Third, comparative analysis highlights both similarities and differences across different contexts.</p>

      <h3>5. Conclusions & Recommendations</h3>
      <ul>
        <li>Further study of ${topic} is recommended for students seeking advanced understanding of ${subject}.</li>
        <li>Practical exercises and case studies should complement theoretical study.</li>
        <li>Collaborative learning and discussion can enhance comprehension of complex aspects.</li>
        <li>Regular review and self-assessment are essential for mastery.</li>
      </ul>
    `;
  }

  function qaTemplate(topic, subject, difficulty, words) {
    const qCount = Math.max(5, Math.floor(words / 60));
    const questions = [
      `What is the definition and scope of ${topic}?`,
      `What are the key principles and concepts underlying ${topic}?`,
      `How does ${topic} relate to other concepts in ${subject}?`,
      `What are the real-world applications of ${topic}?`,
      `What are the main challenges associated with studying ${topic}?`,
      `How has understanding of ${topic} evolved over time?`,
      `What are the most significant contributions to the study of ${topic}?`,
      `How can knowledge of ${topic} be applied in professional settings?`
    ].slice(0, qCount);

    let html = `
      <div class="tag-row">
        <span class="tag tag-subject">${subject}</span>
        <span class="tag tag-difficulty">Q&A Format · ${qCount} Questions</span>
      </div>
      <h2 style="margin-top:0">Q&A: ${topic}</h2>
    `;
    questions.forEach((q, i) => {
      html += `
        <div class="step-block">
          <div class="step-num">Q${i+1}</div>
          <div class="step-content">
            <strong>${q}</strong>
            <p>Answer: ${topic} in the context of ${subject} involves a careful examination of key concepts, their interactions, and their applications. The answer to this question requires understanding both theoretical foundations and practical implications. Students should refer to their textbooks and classroom notes for detailed, subject-specific responses, while using this guide as a structural framework.</p>
          </div>
        </div>
      `;
    });
    return html;
  }

  function projectTemplate(topic, subject, difficulty, words) {
    return `
      <div class="tag-row">
        <span class="tag tag-subject">${subject}</span>
        <span class="tag tag-difficulty">Project Plan</span>
      </div>
      <h2 style="margin-top:0">Project Plan: ${topic}</h2>

      <h3>Project Overview</h3>
      <p><strong>Topic:</strong> ${topic}<br><strong>Subject:</strong> ${subject}<br><strong>Objective:</strong> To research, analyze, and present findings on ${topic} in a structured and comprehensive manner.</p>

      <h3>Phase 1: Research (Days 1-3)</h3>
      <ul>
        <li>Collect books, articles, and online resources on ${topic}</li>
        <li>Identify key sub-topics and areas of focus</li>
        <li>Take organized notes with citations</li>
        <li>Identify 3-5 key questions your project will answer</li>
      </ul>

      <h3>Phase 2: Organization (Days 4-5)</h3>
      <ul>
        <li>Create an outline with sections and sub-sections</li>
        <li>Sort research notes by topic area</li>
        <li>Identify any gaps in research and fill them</li>
        <li>Draft the project structure</li>
      </ul>

      <h3>Phase 3: Writing & Creation (Days 6-9)</h3>
      <ul>
        <li>Write introduction and background sections</li>
        <li>Develop main body with evidence and analysis</li>
        <li>Create visuals: charts, diagrams, flowcharts</li>
        <li>Write conclusion and recommendations</li>
      </ul>

      <h3>Phase 4: Review & Submit (Days 10)</h3>
      <ul>
        <li>Proofread for grammar and clarity</li>
        <li>Verify all references and citations</li>
        <li>Format according to requirements</li>
        <li>Submit final project</li>
      </ul>

      <h3>Evaluation Criteria</h3>
      <ul>
        <li>Content accuracy and depth (40%)</li>
        <li>Organization and structure (25%)</li>
        <li>Originality and critical thinking (20%)</li>
        <li>Presentation and formatting (15%)</li>
      </ul>
    `;
  }

  /* =========================================================
     ROADMAP GENERATOR
  ========================================================= */
  const roadmapDatabase = {
    python: {
      phases: [
        { name: 'Foundations', topics: ['Variables & Data Types', 'Control Flow (if/else)', 'Loops (for, while)', 'Functions', 'Input/Output'] },
        { name: 'Core Concepts', topics: ['Lists, Tuples, Dicts', 'File Handling', 'Error Handling', 'Modules & Packages', 'OOP Basics'] },
        { name: 'Intermediate', topics: ['List Comprehensions', 'Lambda Functions', 'Regular Expressions', 'Working with APIs', 'Virtual Environments'] },
        { name: 'Projects', topics: ['Calculator App', 'To-Do List', 'Web Scraper', 'Data Analysis with Pandas', 'Final Portfolio Project'] }
      ]
    },
    jee: {
      phases: [
        { name: 'Physics Fundamentals', topics: ['Mechanics & Kinematics', 'Thermodynamics', 'Waves & Optics', 'Electrostatics', 'Magnetism'] },
        { name: 'Chemistry Core', topics: ['Physical Chemistry', 'Organic Reactions', 'Inorganic Chemistry', 'Equilibrium', 'Electrochemistry'] },
        { name: 'Mathematics', topics: ['Calculus (Diff + Integral)', 'Coordinate Geometry', 'Algebra & Matrices', 'Probability', 'Trigonometry'] },
        { name: 'Practice & Revision', topics: ['Previous Year Papers', 'Mock Tests', 'Weak Area Revision', 'Speed & Accuracy Drills', 'Full Syllabus Revision'] }
      ]
    },
    dsa: {
      phases: [
        { name: 'Arrays & Strings', topics: ['Array operations', 'Two-pointer technique', 'Sliding window', 'String manipulation', 'Prefix sums'] },
        { name: 'Linked Lists & Stacks', topics: ['Singly linked list', 'Doubly linked list', 'Stack & Queue', 'Deque', 'Priority Queue'] },
        { name: 'Trees & Graphs', topics: ['Binary trees', 'BST operations', 'BFS & DFS', 'Graph representation', 'Shortest path algorithms'] },
        { name: 'Advanced', topics: ['Dynamic Programming', 'Greedy algorithms', 'Backtracking', 'Divide & conquer', 'Bit manipulation'] }
      ]
    },
    web: {
      phases: [
        { name: 'HTML & CSS', topics: ['HTML structure & semantics', 'CSS selectors & properties', 'Flexbox & Grid', 'Responsive design', 'CSS animations'] },
        { name: 'JavaScript', topics: ['JS fundamentals', 'DOM manipulation', 'Events & listeners', 'Async/Promises/Fetch', 'ES6+ features'] },
        { name: 'Framework', topics: ['React basics', 'Components & Props', 'State & Hooks', 'React Router', 'State management'] },
        { name: 'Backend & Deploy', topics: ['Node.js basics', 'Express server', 'REST API design', 'Database basics', 'Deploy to Vercel/GitHub Pages'] }
      ]
    }
  };

  function getRoadmapKey(goal) {
    const lower = goal.toLowerCase();
    if (/python/.test(lower)) return 'python';
    if (/jee|entrance|engineering/.test(lower)) return 'jee';
    if (/dsa|data struct|algorithm/.test(lower)) return 'dsa';
    if (/web dev|html|css|react|frontend/.test(lower)) return 'web';
    return null;
  }

  function generateRoadmap(goal, duration, hours, level) {
    const days = parseInt(duration);
    const hrs = parseInt(hours);
    const key = getRoadmapKey(goal);
    const db = key ? roadmapDatabase[key] : null;

    let html = `
      <div class="tag-row">
        <span class="tag tag-subject">${goal}</span>
        <span class="tag tag-concept">${days} Days · ${hrs} hrs/day · ${level.charAt(0).toUpperCase()+level.slice(1)}</span>
      </div>
      <h2 style="margin-top:0">Roadmap: ${goal}</h2>
    `;

    const weeksTotal = Math.ceil(days / 7);
    const phases = db ? db.phases : generateGenericPhases(goal, days);
    const daysPerPhase = Math.floor(days / phases.length);

    phases.forEach((phase, pi) => {
      const startDay = pi * daysPerPhase + 1;
      const endDay = Math.min((pi + 1) * daysPerPhase, days);
      const weekStart = Math.ceil(startDay / 7);
      const weekEnd = Math.ceil(endDay / 7);

      html += `
        <div class="week-block">
          <div class="week-header">Phase ${pi+1}: ${phase.name} (Day ${startDay}–${endDay})</div>
          <div class="milestone-block">
            <strong>🎯 Phase Goal:</strong> Master the fundamentals of ${phase.name} and be able to apply the concepts independently.
          </div>
      `;

      phase.topics.forEach((topic, ti) => {
        const dayNum = startDay + Math.floor((ti / phase.topics.length) * (endDay - startDay));
        html += `
          <div class="day-item">
            <span class="day-label">Day ${dayNum}</span>
            <div class="day-tasks">
              <div class="checklist-item">
                <input type="checkbox" id="task-${pi}-${ti}" />
                <label for="task-${pi}-${ti}"><strong>${topic}</strong> — ${hrs}h study session</label>
              </div>
            </div>
          </div>
        `;
      });

      html += `
          <div style="padding:0.5rem 0.9rem;color:var(--text-faint);font-size:0.8rem;">
            📚 Resources: Textbooks, online tutorials, practice problems, YouTube explanations
          </div>
        </div>
      `;
    });

    html += `
      <div class="milestone-block" style="margin-top:1rem">
        <strong>🏆 Final Milestone (Day ${days}):</strong> Complete a comprehensive revision, take a mock test / build a project, and evaluate your progress against your starting point.
      </div>
      <h3>Study Tips</h3>
      <ul>
        <li>⏰ Use the <strong>Pomodoro technique</strong>: 25 min study + 5 min break</li>
        <li>📝 <strong>Active recall</strong>: Test yourself instead of just re-reading</li>
        <li>🔁 <strong>Spaced repetition</strong>: Review material at increasing intervals</li>
        <li>👥 <strong>Teach it</strong>: Explain concepts to friends or yourself out loud</li>
        <li>📊 Track progress daily — check off completed tasks above!</li>
      </ul>
    `;
    return html;
  }

  function generateGenericPhases(goal, days) {
    return [
      { name: 'Foundation & Basics', topics: ['Core concepts overview', 'Key terminology', 'Fundamental principles', 'Basic practice exercises'] },
      { name: 'Core Learning', topics: ['Deep dive into main topics', 'Worked examples', 'Problem solving', 'Conceptual connections'] },
      { name: 'Application', topics: ['Applied exercises', 'Real-world examples', 'Case studies', 'Complex problems'] },
      { name: 'Mastery & Review', topics: ['Full topic revision', 'Practice tests', 'Weak area focus', 'Final assessment'] }
    ];
  }

  /* =========================================================
     FLOWCHART GENERATOR
  ========================================================= */
  const flowchartDatabase = {
    'computer': {
      type: 'process',
      nodes: [
        { type: 'start', text: 'START' },
        { type: 'io', text: 'User Input (Keyboard / Mouse)' },
        { type: 'process', text: 'CPU Fetches Instruction from Memory' },
        { type: 'process', text: 'CPU Decodes Instruction' },
        { type: 'process', text: 'CPU Executes Instruction' },
        { type: 'decision', text: 'More Instructions?' },
        { type: 'process', text: 'Store Result in Memory/Register' },
        { type: 'io', text: 'Output to Display / Storage' },
        { type: 'end', text: 'END' }
      ]
    },
    'photosynthesis': {
      type: 'process',
      nodes: [
        { type: 'start', text: 'Sunlight Hits Leaf' },
        { type: 'process', text: 'Chlorophyll Absorbs Light Energy' },
        { type: 'process', text: 'Light Reactions (Thylakoid)' },
        { type: 'process', text: 'Water (H₂O) is Split' },
        { type: 'io', text: 'O₂ Released as Byproduct' },
        { type: 'process', text: 'ATP & NADPH Produced' },
        { type: 'process', text: 'Calvin Cycle (Stroma)' },
        { type: 'process', text: 'CO₂ Fixed into Glucose (C₆H₁₂O₆)' },
        { type: 'end', text: 'Glucose Used for Energy / Growth' }
      ]
    },
    'water': {
      type: 'cycle',
      nodes: ['Evaporation (Water → Water Vapor)', 'Condensation (Forms Clouds)', 'Precipitation (Rain/Snow)', 'Surface Runoff & Collection', 'Infiltration into Ground', 'Transpiration from Plants']
    },
    'internet': {
      type: 'process',
      nodes: [
        { type: 'start', text: 'User Enters URL in Browser' },
        { type: 'process', text: 'DNS Resolves Domain to IP Address' },
        { type: 'process', text: 'Browser Sends HTTP Request' },
        { type: 'process', text: 'Request Travels Through Routers' },
        { type: 'process', text: 'Web Server Receives Request' },
        { type: 'process', text: 'Server Processes & Generates Response' },
        { type: 'io', text: 'HTML/CSS/JS Sent Back to Browser' },
        { type: 'process', text: 'Browser Parses & Renders Page' },
        { type: 'end', text: 'Website Displays to User' }
      ]
    },
    'math problem': {
      type: 'decision',
      nodes: [
        { type: 'start', text: 'Read the Problem' },
        { type: 'process', text: 'Identify Known Values' },
        { type: 'process', text: 'Identify Unknown Values' },
        { type: 'decision', text: 'Formula Known?' },
        { type: 'process', text: 'Apply the Formula' },
        { type: 'process', text: 'Look Up / Derive Formula' },
        { type: 'process', text: 'Solve Step by Step' },
        { type: 'decision', text: 'Answer Correct?' },
        { type: 'process', text: 'Verify Answer' },
        { type: 'end', text: 'Write Final Answer' }
      ]
    }
  };

  function generateFlowchart(topic, flowType) {
    const lower = topic.toLowerCase();
    let key = null;
    for (const k of Object.keys(flowchartDatabase)) {
      if (lower.includes(k)) { key = k; break; }
    }

    if (key && flowchartDatabase[key].type === 'cycle') {
      return generateCycleDiagram(topic, flowchartDatabase[key].nodes);
    }

    const nodes = key ? flowchartDatabase[key].nodes : generateGenericFlow(topic, flowType);
    if (flowType === 'cycle') return generateCycleDiagram(topic, nodes.map(n => n.text || n));
    if (flowType === 'concept') return generateConceptMap(topic);
    return generateProcessFlow(topic, nodes);
  }

  function generateProcessFlow(topic, nodes) {
    let html = `<div class="flowchart-wrap">`;
    nodes.forEach((node, i) => {
      html += `<div class="flow-node ${node.type}">${node.text}</div>`;
      if (i < nodes.length - 1) html += `<div class="flow-arrow"></div>`;
    });
    html += `</div>`;
    return html;
  }

  function generateCycleDiagram(topic, nodes) {
    let html = `
      <h3 style="text-align:center;margin-bottom:1rem;color:var(--text)">🔄 ${topic} — Cycle Diagram</h3>
      <div style="text-align:center;color:var(--text-muted);font-size:0.82rem;margin-bottom:1rem">Each stage leads to the next in a continuous cycle</div>
      <div class="cycle-container">
    `;
    nodes.forEach((node, i) => {
      html += `<div class="cycle-node">${i+1}. ${node}</div>`;
    });
    html += `</div>`;
    return html;
  }

  function generateConceptMap(topic) {
    return `
      <div class="concept-center">${topic}</div>
      <div class="concept-branches">
        <div class="concept-branch">
          <h4>📖 Definition</h4>
          <ul><li>Core meaning</li><li>Formal definition</li><li>Simple explanation</li></ul>
        </div>
        <div class="concept-branch">
          <h4>🔑 Key Components</h4>
          <ul><li>Main elements</li><li>Sub-parts</li><li>Related concepts</li></ul>
        </div>
        <div class="concept-branch">
          <h4>⚙️ How It Works</h4>
          <ul><li>Mechanism</li><li>Process steps</li><li>Cause & effect</li></ul>
        </div>
        <div class="concept-branch">
          <h4>🌍 Applications</h4>
          <ul><li>Real-world uses</li><li>Examples</li><li>Case studies</li></ul>
        </div>
        <div class="concept-branch">
          <h4>✅ Advantages</h4>
          <ul><li>Benefits</li><li>Strengths</li><li>Positive impact</li></ul>
        </div>
        <div class="concept-branch">
          <h4>⚠️ Limitations</h4>
          <ul><li>Drawbacks</li><li>Challenges</li><li>Constraints</li></ul>
        </div>
      </div>
    `;
  }

  function generateGenericFlow(topic, flowType) {
    if (flowType === 'decision') {
      return [
        { type: 'start', text: 'Start' },
        { type: 'process', text: `Analyze ${topic}` },
        { type: 'decision', text: 'Condition A?' },
        { type: 'process', text: 'Path A: Action 1' },
        { type: 'process', text: 'Path B: Action 2' },
        { type: 'process', text: 'Evaluate Result' },
        { type: 'decision', text: 'Goal Achieved?' },
        { type: 'process', text: 'Adjust Approach' },
        { type: 'end', text: 'End' }
      ];
    }
    return [
      { type: 'start', text: 'Begin' },
      { type: 'process', text: `Understand ${topic}` },
      { type: 'process', text: 'Identify Key Components' },
      { type: 'process', text: 'Analyze Relationships' },
      { type: 'process', text: 'Apply Core Principles' },
      { type: 'process', text: 'Evaluate Outcomes' },
      { type: 'io', text: 'Document Results' },
      { type: 'end', text: 'Complete' }
    ];
  }

  /* =========================================================
     NOTES FORMATTER
  ========================================================= */
  function formatNotes(title, content, style) {
    const keywords = extractKeywords(content);
    const highlighted = highlightKeywords(content, keywords);

    if (style === 'cornell') return cornellNotes(title, content, keywords);
    if (style === 'mindmap') return mindMapNotes(title, content);
    if (style === 'flashcard') return flashcardNotes(title, content);
    return structuredNotes(title, highlighted, keywords);
  }

  function extractKeywords(text) {
    const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','shall','should','may','might','must','can','could','to','of','in','on','at','by','for','with','from','as','it','its','this','that','these','those','and','or','but','not','if','then','else','so','because','which','who','when','where','what','how','all','any','each','every','more','most','some','such']);
    const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const freq = {};
    words.forEach(w => { if (!stopWords.has(w)) freq[w] = (freq[w]||0)+1; });
    return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,10).map(e=>e[0]);
  }

  function highlightKeywords(text, keywords) {
    let result = text;
    keywords.slice(0,6).forEach(kw => {
      const re = new RegExp(`\\b(${kw})\\b`, 'gi');
      result = result.replace(re, '<span class="keyword-highlight">$1</span>');
    });
    return result;
  }

  function structuredNotes(title, content, keywords) {
    const lines = content.split('\n').filter(l => l.trim());
    let html = `
      <div style="border-left:3px solid var(--primary);padding-left:1rem;margin-bottom:1.25rem">
        <h2 style="border:none;margin:0">${title || 'Notes'}</h2>
        <p style="font-size:0.78rem;color:var(--text-faint);margin:0.2rem 0 0">Generated ${new Date().toLocaleDateString()}</p>
      </div>
    `;
    if (keywords.length) {
      html += `<div class="tag-row" style="margin-bottom:1rem">${keywords.slice(0,6).map(k=>`<span class="tag tag-concept">${k}</span>`).join('')}</div>`;
    }
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        const lvl = trimmed.match(/^#+/)[0].length;
        const text = trimmed.replace(/^#+\s*/, '');
        html += `<h${Math.min(lvl+1,4)} style="color:var(--text)">${text}</h${Math.min(lvl+1,4)}>`;
      } else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        html += `<ul><li>${trimmed.replace(/^[-•*]\s*/, '')}</li></ul>`;
      } else if (trimmed) {
        html += `<p>${highlightKeywords(trimmed, keywords.slice(0,6))}</p>`;
      }
    });
    return html;
  }

  function cornellNotes(title, content, keywords) {
    return `
      <h2 style="border-bottom:2px solid var(--primary);padding-bottom:0.5rem;margin-bottom:1rem">${title || 'Cornell Notes'}</h2>
      <div class="cornell-container">
        <div class="cornell-cue">
          <h3 style="font-size:0.85rem;color:var(--primary-soft)">Cue Column</h3>
          ${keywords.slice(0,6).map(k=>`<p style="font-weight:600;color:var(--text);font-size:0.88rem">${k}?</p>`).join('')}
          <p style="color:var(--text-muted);font-size:0.82rem;margin-top:1rem">Key Questions & Prompts</p>
        </div>
        <div class="cornell-notes">
          <h3 style="font-size:0.85rem;color:var(--primary-soft)">Notes Column</h3>
          ${content.split('\n').filter(l=>l.trim()).map(l=>`<p style="font-size:0.88rem">${l}</p>`).join('')}
        </div>
        <div class="cornell-summary">
          <h3 style="font-size:0.85rem;color:var(--accent-dim)">Summary</h3>
          <p style="font-size:0.88rem">Key takeaways from <strong>${title}</strong>: ${keywords.slice(0,4).join(', ')}. Review these concepts regularly using the cue column for active recall.</p>
        </div>
      </div>
    `;
  }

  function mindMapNotes(title, content) {
    const lines = content.split('\n').filter(l=>l.trim()).slice(0,8);
    return `
      <div class="concept-center">${title || 'Central Topic'}</div>
      <div class="concept-branches">
        ${lines.map((line,i)=>`
          <div class="concept-branch">
            <h4>${['📌','💡','🔑','⚡','🎯','📚','🔬','🌟'][i%8]} Branch ${i+1}</h4>
            <p style="font-size:0.85rem;color:var(--text)">${line.replace(/^[-•*#\s]+/,'')}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  function flashcardNotes(title, content) {
    const lines = content.split('\n').filter(l=>l.trim()).slice(0,8);
    let html = `<h2>${title} — Flashcards</h2>`;
    lines.forEach((line, i) => {
      const clean = line.replace(/^[-•*#\s]+/,'');
      const parts = clean.split(':');
      html += `
        <div class="flashcard">
          <div class="flashcard-q">Q${i+1}: ${parts[0] || clean}</div>
          <div class="flashcard-a">A: ${parts[1] || 'Refer to your textbook for the detailed answer to this concept.'}</div>
        </div>
      `;
    });
    return html;
  }

  /* =========================================================
     PUBLIC API
  ========================================================= */
  return {
    detect: detectTopic,
    solveDoubt(question, forcedSubject) {
      const subject = forcedSubject === 'auto' ? detectTopic(question) : forcedSubject;
      const fn = doubtTemplates[subject] || doubtTemplates.general;
      return { html: fn(question), subject };
    },
    generateAssignment,
    generateRoadmap,
    generateFlowchart,
    formatNotes
  };

})();
