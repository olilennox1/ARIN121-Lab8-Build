import { SampleNote } from './types';

export const SAMPLE_NOTES: SampleNote[] = [
  {
    id: 'bio-respiration',
    title: 'Cellular Respiration & ATP Synthesis',
    subject: 'Biology 101',
    content: `Cellular respiration is the metabolic process that converts biochemical energy from nutrients into adenosine triphosphate (ATP).

1. Glycolysis:
- Occurs in the cytoplasm (cytosol).
- Anaerobic process (does not require O2).
- Breaks 1 glucose (6-carbon) into 2 pyruvate (3-carbon) molecules.
- Net yield: 2 ATP (via substrate-level phosphorylation) and 2 NADH.

2. Pyruvate Oxidation (Transition Step):
- Occurs in the mitochondrial matrix.
- Each pyruvate is converted into Acetyl-CoA, producing 1 NADH and releasing 1 CO2 per pyruvate (2 CO2 total per glucose).

3. Citric Acid Cycle (Krebs Cycle):
- Occurs in the mitochondrial matrix.
- Acetyl-CoA combines with oxaloacetate to form citrate.
- Per turn (2 turns per glucose): produces 3 NADH, 1 FADH2, 1 ATP (or GTP), and 2 CO2.

4. Oxidative Phosphorylation (Electron Transport Chain & Chemiosmosis):
- Located in the inner mitochondrial membrane (cristae).
- High-energy electrons from NADH and FADH2 pass through complexes I-IV.
- Protons (H+) are pumped into the intermembrane space, generating an electrochemical gradient.
- Oxygen serves as the final electron acceptor, combining with protons to form H2O.
- ATP synthase harnesses proton-motive force via chemiosmosis to produce ~26-28 ATP.
- Total theoretical yield: ~30-32 ATP per glucose molecule.`,
  },
  {
    id: 'econ-elasticity',
    title: 'Price Elasticity of Demand & Supply',
    subject: 'Economics 201',
    content: `Price Elasticity of Demand (PED) measures the responsiveness of the quantity demanded of a good to a change in its price.

Formula:
PED = (% Change in Quantity Demanded) / (% Change in Price)
Calculated using the midpoint formula to avoid directional bias.

Classifications of Elasticity:
1. Perfectly Inelastic (PED = 0): Quantity demanded does not respond to price changes (e.g., life-saving insulin). Vertical demand curve.
2. Inelastic (0 < |PED| < 1): Percentage change in quantity is smaller than percentage change in price (e.g., gasoline, basic necessities).
3. Unit Elastic (|PED| = 1): Percentage change in quantity equals percentage change in price.
4. Elastic (|PED| > 1): Quantity demanded responds substantially to price changes (e.g., luxury cars, airline vacation tickets).
5. Perfectly Elastic (|PED| = infinity): Any increase in price drops demand to zero. Horizontal demand curve.

Total Revenue Test:
- Inelastic Demand: Price increase leads to total revenue increase (P and TR move in the same direction).
- Elastic Demand: Price increase leads to total revenue decrease (P and TR move in opposite directions).
- Unitary: Total revenue remains constant at maximum.

Key Determinants:
- Availability of close substitutes (more substitutes = more elastic).
- Necessities vs. luxuries.
- Proportion of consumer budget (higher share = more elastic).
- Time horizon (demand tends to be more elastic in the long run as consumers find substitutes).`,
  },
  {
    id: 'cs-sorting',
    title: 'Algorithm Complexity & Sorting Techniques',
    subject: 'Computer Science 102',
    content: `Computational complexity describes the efficiency of algorithms using asymptotic notation (Big-O).

Common Time Complexities:
- O(1): Constant time (e.g., hash table lookup, array index access).
- O(log n): Logarithmic time (e.g., binary search on sorted array).
- O(n): Linear time (e.g., single pass traversal, linear search).
- O(n log n): Linearithmic time (e.g., Merge Sort, Heap Sort, average Quick Sort).
- O(n^2): Quadratic time (e.g., Bubble Sort, Insertion Sort, Selection Sort).

Key Sorting Algorithms:
1. Merge Sort:
- Divide and conquer strategy: splits array in half, recursively sorts, merges halves.
- Time Complexity: O(n log n) in best, average, and worst cases.
- Space Complexity: O(n) auxiliary space (not in-place).
- Stability: Stable sorting algorithm.

2. Quick Sort:
- Selects a pivot element, partitions elements into smaller and larger subsets.
- Time Complexity: O(n log n) average case; O(n^2) worst case (e.g., bad pivot choice on already sorted array).
- In-place partitioning: O(log n) auxiliary stack space.

3. Binary Search:
- Requires a sorted array.
- Compares target with middle element, discards half of remaining search space each step.
- Time Complexity: O(log n) worst case; O(1) best case.`,
  },
];
