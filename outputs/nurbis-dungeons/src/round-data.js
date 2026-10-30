import {rooms as collection,solutions as collectionSolutions,introductions as collectionIntroductions} from './sammlung-collection.js';
import {rooms as pushing} from './interlock-collection.js';
import {rooms as switches} from './counterflow-collection.js';
import {rooms as boards} from './fracture-collection.js';
import {rooms as water} from './basin-room-collection.js';
import {solution as pushSolution} from './interlock-solution.js';
import {solution as switchSolution} from './counterflow-solution.js';
import {solution as boardSolution} from './fracture-solution.js';
import {solution as waterSolution} from './basin-room-solution.js';
import {rooms as expansion,solutions as expansionSolutions,introductions as expansionIntroductions} from './expansion-collection.js';
import {rooms as comparison,solutions as comparisonSolutions,introductions as comparisonIntroductions} from './comparison-collection.js';

export const rooms=[pushing[0],switches[0],boards[0],water[0],...expansion,...comparison,...collection];
export const solutions=[pushSolution,switchSolution,boardSolution,waterSolution,...expansionSolutions,...comparisonSolutions,...collectionSolutions];
export const introductions=[
 'Vier Steine teilen sich enge Wege. Erreiche den Gartenfreund und öffne euren Ausgang.',
 'Die Wippe öffnet zwei Durchgänge abwechselnd. Plane Steintransport und Schalterseite zusammen.',
 'Die Bretter tragen Nurbi einmal. Beim Verlassen bricht die benötigte Standfläche weg.',
 'Leere Becken sind nutzbare Wege. Die Wippe tauscht das Wasser zwischen ihnen.',
 ...expansionIntroductions,
 ...comparisonIntroductions,
 ...collectionIntroductions
];
