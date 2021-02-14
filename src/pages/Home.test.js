// 90% of time, you will use shallow. this tests one component at time. If there is another comp in the rendering, it will be ignored.
// mount for DOM browser rendering
// TIP: if the component has many functionalities such redux and diffent functions, try to write a new component with only the essencial logic...
// render
import { shallow } from "enzyme";
import Home from "./Home";

it("expect to render Home Component", () => {
    expect(shallow(<Home />)).toMatchSnapshot(); // n1
});

// it("expect to render Home Component", () => {
//     expect(shallow(<Home />).length).toEqual(1);
// })
// console.log(shallow(<Home />));

/* COMMENTS
n1: Snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly.
A typical snapshot test case for a mobile app renders a UI component, takes a snapshot, then compares it to a reference snapshot file stored alongside the test. The test will fail if the two snapshots do not match: either the change is unexpected, or the reference snapshot needs to be updated to the new version of the UI component.
https://jestjs.io/docs/en/snapshot-testing

npm test -- --coverage = to see all components testing coverage.
*/
