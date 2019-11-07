import React from 'react'
import {Link} from 'react-router-dom'
import {Menu, Icon} from 'antd'

import {LANG} from '@lang'

const defaultProps = {
  theme: 'dark'
}
type DefaultProps = typeof defaultProps

const NavMenu = ({theme}: DefaultProps) =>
  <div className="nav-bar">
    <Menu
      mode="horizontal"
      theme={theme as any}
    >
      <Menu.Item key="1">
        <Icon type="search" />
        <span>{LANG.t('consumer.nav.Search')}</span>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to={'/download'}>
          <Icon type="download" />
          <span>{LANG.t('consumer.nav.Downloads')}</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to={'/documentation'}>
          <Icon type="question-circle" />
          <span>{LANG.t('consumer.nav.Documentation')}</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to={'/about'}>
          <Icon type="info-circle" />
          <span>{LANG.t('consumer.nav.About')}</span>
        </Link>
      </Menu.Item>
    </Menu>
  </div>

export default NavMenu