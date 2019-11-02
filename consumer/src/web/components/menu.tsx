import React, { Component } from 'react'

import { Menu, Icon } from 'antd'
const { SubMenu } = Menu

const defaultProps = {
  collapsed: false
}
type DefaultProps = typeof defaultProps

const SideMenu = ({collapsed}: DefaultProps) =>
  <Menu
    mode="inline"
    theme="dark"
    inlineCollapsed={collapsed}
  >
    <Menu.Item key="1">
      <Icon type="pie-chart" />
      <span>Posts</span>
    </Menu.Item>
    <Menu.Item key="2">
      <Icon type="desktop" />
      <span>Events</span>
    </Menu.Item>
    <Menu.Item key="3">
      <Icon type="inbox" />
      <span>Products</span>
    </Menu.Item>
    <SubMenu
      key="sub1"
      title={
        <span>
          <Icon type="mail" />
          <span>Navigation One</span>
        </span>
      }
    >
      <Menu.Item key="5">Option 5</Menu.Item>
      <Menu.Item key="6">Option 6</Menu.Item>
      <Menu.Item key="7">Option 7</Menu.Item>
      <Menu.Item key="8">Option 8</Menu.Item>
    </SubMenu>
    <SubMenu
      key="sub2"
      title={
        <span>
          <Icon type="appstore" />
          <span>Navigation Two</span>
        </span>
      }
    >
      <Menu.Item key="9">Option 9</Menu.Item>
      <Menu.Item key="10">Option 10</Menu.Item>
      <SubMenu key="sub3" title="Submenu">
        <Menu.Item key="11">Option 11</Menu.Item>
        <Menu.Item key="12">Option 12</Menu.Item>
      </SubMenu>
    </SubMenu>
  </Menu>

export default SideMenu