import React, { Component } from 'react';
import { Window, TitleBar, Text, SegmentedControl, SegmentedControlItem } from 'react-desktop/macOs';

export default class extends Component {
  render() {
    return (
      <Window
        chrome
        padding="10px"
      >
        <TitleBar title="Radiant Settings" />
        <Text>Hello World</Text>
        <SegmentedControl box>
          <SegmentedControlItem title="General"><Text>Something 1</Text></SegmentedControlItem>
          <SegmentedControlItem title="Appearance"><Text>Something 2</Text></SegmentedControlItem>
          <SegmentedControlItem title="Navigation"><Text>Something 3</Text></SegmentedControlItem>
          <SegmentedControlItem title="Privacy"><Text>Something 3</Text></SegmentedControlItem>
          <SegmentedControlItem title="Last.fm"><Text>Something 3</Text></SegmentedControlItem>
          <SegmentedControlItem title="Advanced"><Text>Something 3</Text></SegmentedControlItem>
        </SegmentedControl>
      </Window>
    );
  }
}
