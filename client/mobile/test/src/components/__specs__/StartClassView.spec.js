import React from "react";
import { mount, shallow } from "enzyme";

import StartClassView from "../our-component";

describe("<StartClassView/>", () => {
  it('Should exist when instantiated', () => {
    expect(<StartClassView />).to.exist;
  });
});
