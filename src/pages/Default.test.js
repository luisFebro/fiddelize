import { mount } from "enzyme";
import Default from "./Default";

it("expect to render Default Component", () => {
    expect(mount(<Default />)).toMatchSnapshot(); // n1
});

/* COMMENTS
n1: Snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly.
A typical snapshot test case for a mobile app renders a UI component, takes a snapshot, then compares it to a reference snapshot file stored alongside the test. The test will fail if the two snapshots do not match: either the change is unexpected, or the reference snapshot needs to be updated to the new version of the UI component.
https://jestjs.io/docs/en/snapshot-testing

npm test -- --coverage = to see all components testing coverage.
*/
