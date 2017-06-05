import React, { PureComponent } from 'react'
import sortOn from 'sort-on'
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'

import { RepoItem } from '../../components'

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
})

export class Trending extends PureComponent {

  static navigatorButtons = {
    leftButtons: [
      {
        title: 'Edit',
        id: 'edit'
      }
    ],
    rightButtons: [
      {
        title: 'Search',
        id: 'search',
        icon: require('../../icons/search.png')
      }
    ]
  }


    constructor(props) {
      super(props)

      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
    }

    onNavigatorEvent = ({ type, id }) => {
      const { user, navigator } = this.props

      if (type === 'NavBarButtonPress') {
        if (id === 'search') {
          navigator.push({
            screen: 'githubnative.Search',
            title: 'Search',
            animated: true
          })
        }
      }
    }

  render () {
    const { list, loading, fetchRepos } = this.props

    if (!list.length) return (
      <ActivityIndicator style={{marginTop: 50}} />
    )

    return (
      <View style={styles.list}>
        <ScrollView
          style={{height: 0}}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchRepos}
              tintColor='black'
              title='Loading...'
              titleColor='black'
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor='#ffff00'
            />
          }
        >
          {
            list && list.map((n, index) => (
              <TouchableOpacity key={index}>
                <RepoItem
                  name={n.name}
                  language={n.language}
                  description={n.description}
                  stars={n.stargazers_count}
                />
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    )
  }
}

export default Trending
