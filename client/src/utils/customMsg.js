import getRandomArray from "./arrays/getRandomArray";

const data = {};

const customMsg = (mainSubject, name = "NeedCustomWord", type = "added") => {
    name = name.cap();
    data.added = [
        `Opa, ${mainSubject} com sucesso, ${name}!`,
        `${name}, ${mainSubject} com sucesso!`,
        `${mainSubject} com sucesso!`,
        `${mainSubject}!`,
        `${mainSubject}, ${name}!`,
        `Mais um ${mainSubject}`,
        `Este item foi ${mainSubject}`,
        `Este item foi ${mainSubject}, ${name}`,
        `${name}, este item foi ${mainSubject}`,
    ];

    data.removed = [
        `${mainSubject} com sucesso, ${name}!`,
        `${name}, ${mainSubject} com sucesso!`,
        `${mainSubject} com sucesso!`,
        `${mainSubject}!`,
        `${mainSubject}, ${name}!`,
        `Este item foi ${mainSubject}`,
        `Este item foi ${mainSubject}, ${name}`,
        `${name}, este item foi ${mainSubject}`,
    ];
    const pickedMsg = getRandomArray(data[type]);
    const needThrowErr = pickedMsg.includes("NeedCustomWord");
    if (needThrowErr) throw new Error("It is required a customized string");

    return pickedMsg;
};

export default customMsg;
