import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Layout } from 'antd'
import 'antd/dis/antd.css'

const { Header, Footer, Sider, Content } = Layout

class App extends Component {
  render() {
    return (
      <>
        <Layout>
          <Sider>sider</Sider>
          <Layout>
            <Header>header</Header>
            <Content>content</Content>
            <Footer>footer</Footer>
          </Layout>
        </Layout>
      </>
    )
  }
}

export default App