// This is a separated file because it was priorly sorting the original array when exportinh..
import sortObjKeyInArrayAlphabet from '../utils/arrays/sortObjKeyInArrayAlphabet';
import { milestoneIcons } from './milestoneIcons';

const milestoneIconsSorted = sortObjKeyInArrayAlphabet(milestoneIcons, "ptBr", true);

export { milestoneIconsSorted };

export const getIconIndex = icon => {
    const foundIcon = milestoneIconsSorted.find(ic => ic.icon === icon);
    if(!foundIcon) return "";
    return foundIcon.id;
}