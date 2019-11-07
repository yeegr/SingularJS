import React from 'react'
import {Menu, Button, Icon} from 'antd'
const {SubMenu} = Menu

import {LANG} from '@lang'

interface props {
  collapsed: boolean
  theme: string
}

class SideMenu extends React.Component<props> {
  constructor(props: props) {
    super(props)
  }

  render() {
    let loginMenu = (true) ? 
      <LoginMenuItem /> :
      <UserMenuItem />

    return (
      <div className="menu">
        <Menu
          mode="vertical"
          inlineCollapsed={this.props.collapsed}
          theme={this.props.theme as any}
          style={{
            flex: 1,
            position: 'relative'
          }}
        >
          <Menu.Item key="1">
            <Icon type="file" />
            <span>{LANG.t('consumer.menu.Posts')}</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="calendar" />
            <span>{LANG.t('consumer.menu.Events')}</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="team" />
            <span>{LANG.t('consumer.menu.People')}</span>
          </Menu.Item>
          <Menu.Item key="4">
            <Icon type="message" />
            <span>{LANG.t('consumer.menu.Messages')}</span>
          </Menu.Item>
          <Menu.Item key="5">
            <Icon type="shopping" />
            <span>{LANG.t('consumer.menu.Shopping')}</span>
          </Menu.Item>
          <Menu.Item key="6"
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%'
            }}
          >
            {loginMenu}
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

const LoginMenuItem = () =>
  <Menu.Item key="6">
      <Icon type="login" />
      <span>{LANG.t('consumer.menu.Login')}</span>
  </Menu.Item>

const UserMenuItem = () =>
    <Menu.Item key="6">
        <Icon type="login" />
        <span>{LANG.t('consumer.menu.Login')}</span>
    </Menu.Item>

export default SideMenu
