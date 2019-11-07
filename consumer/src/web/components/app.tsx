import React, {Component} from 'react'

import {Layout, Icon} from 'antd'
const {Header, Footer, Sider, Content} = Layout
import './app.less'

import Menu from './menu'
import Nav from './nav'

const initialState = {
  collapsed: false,
  theme: 'dark'
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
          <div className="menu-bar">
            <button onClick={this._toggleCollapsed}>
              <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} style={{ color: 'rgba(255,255,255,.8)' }} />
            </button>
            <div className="logo" />
          </div>
          <Nav 
            theme={this.state.theme}
          />
        </Header>
        <Layout className="main-view">
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            className="side-bar"
            collapsedWidth="64"
            width="120"
          >
            <Menu
              collapsed={this.state.collapsed}
              theme={this.state.theme}
            />
          </Sider>
          <Layout className="main-content">
            <Content>this is the 12th test</Content>
            <Footer>footer</Footer>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default App
