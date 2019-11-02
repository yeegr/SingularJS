import React, { Component } from 'react'

import { Layout, Button, Icon } from 'antd'
const { Header, Footer, Sider, Content } = Layout
import 'antd/dist/antd.css'
import './app.less'

import Menu from './menu'

const initialState = {
  collapsed: false
}
type State = Readonly<typeof initialState>

class App extends Component<object, State> {
  readonly state: State = initialState

  private _toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    return (
      <Layout>
        <Header className="title-bar">
          <button onClick={this._toggleCollapsed}>
            <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} style={{ color: 'rgba(255,255,255,.8)' }} />
          </button>
          <div className="logo" />
        </Header>
        <Layout className="main-content">
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <Menu
              collapsed={this.state.collapsed}
            />
          </Sider>
          <Layout>
            <Content>this is the 8th test</Content>
            <Footer>footer</Footer>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default App
