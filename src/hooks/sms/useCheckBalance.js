import useAPI, { readCredits } from "../api/useAPI";
import { useBizData } from "init";

export default function useCheckBalance() {
    const { bizId } = useBizData();

    const { data: smsBalance } = useAPI({
        url: readCredits(bizId),
        needOnlyOnce: true,
        trigger: bizId,
    });

    return smsBalance;
}
