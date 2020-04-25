import React, { Component } from 'react'

import Banners from 'react-banners'

export default class Banner extends Component {
  render() {
    return (
      <div style={{ overflow: 'hidden' }}>
        <Banners style={{ overflow: 'hidden', width:"700px",height: "120px"}} justify="center">
          <Banners.Blocks textWidth={'80%'}>
            <Banners.Block >
              <Banners.Title fontSize = '2' justify="center">This is a Chatbot for MSF babybonus FAQ </Banners.Title>
              <Banners.SubTitle fontSize = '2' >Chatbot Framework for Babybonus FAQs, input via text or real-time audio streaming to get responses from different chatbots </Banners.SubTitle>
            </Banners.Block>
          </Banners.Blocks>
          <Banners.Texture
            style={{
              width: '90%',
              height: '100%',
              backgroundRepeat: 'no-repeat',
              transform: 'scale(2.5)',
              backgroundSize: 'cover',
              backgroundPosition: '50%',
              backgroundImage:
                'url(//img.alicdn.com/tfs/TB1gqwCgSzqK1RjSZFjXXblCFXa-1141-1259.svg)'
            }} 
          />
        </Banners>
      </div>
    )
  }
}