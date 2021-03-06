import React, { PureComponent } from 'react'
import sortOn from 'sort-on'
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'

import Repos from '../repos/container'

export class Profile extends PureComponent {

  render () {
    const { profile, loading, navigator } = this.props

    const {
      name,
      login,
      company,
      location,
      email,
      blog,
      bio,
      public_repos,
      followers,
      following
    } = profile

    if (loading) return <ActivityIndicator style={{marginTop: 30}}/>

    return (
      <View
        style={styles.list}
      >
        <View style={styles.topSection}>
          <View style={styles.row}>
            <Image
              style={{width: 110, height: 110, borderRadius: 8, marginRight: 10}}
              source={{uri: profile.avatar_url}}
            />

            <View>
              <Text style={{fontSize: 18}}>{name}</Text>
              <Text style={{color: 'gray'}}>{login}</Text>
              <Text style={styles.sub}>{company}</Text>
              <Text style={styles.sub}>{location}</Text>
              <Text style={styles.sub}>{email}</Text>
            </View>
          </View>

          <Text style={{paddingTop: 10}}>{blog}</Text>
          <Text style={{paddingTop: 10}}>{bio}</Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.count}>{public_repos}</Text>
            <Text style={styles.label}>Repos</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.count}>{followers}</Text>
            <Text style={styles.label}>Followers</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.count}>{following}</Text>
            <Text style={styles.label}>Following</Text>
          </View>
        </View>

        <Repos />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  topSection: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    backgroundColor: '#fafbfc',
    padding: 10
  },
  row: {
    flexDirection: 'row'
  },
  name: {
    fontSize: 16,
    color: 'gray'
  },
  count: {
    fontWeight: 'bold',
    fontSize: 22
  },
  sub: {
    fontSize: 16
  },
  label: {
    fontSize: 16
  },
  statItem: {
    alignItems: 'center'
  },
  statRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    borderColor: 'rgba(0,0,0,.1)',
    borderBottomWidth: 1
  },
  closeButton: {
    width: '100%',
    height: 50,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    backgroundColor: '#fafbfc',
    alignItems: 'center',
    justifyContent: 'center'
  }
})


export default Profile
