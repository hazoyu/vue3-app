import Mock from 'mockjs'

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
  const search = url.split('?')[1] //将 url 字符串按 ? 分割，取第二个部分
  if (!search) {
    return {}
  }
  return JSON.parse( //转换为 JSON 对象
    '{"' +
    decodeURIComponent(search) //处理 URL 编码
      .replace(/"/g, '\\"')       //将双引号 " 替换为转义的双引号 \"
      .replace(/&/g, '","')       //将 & 替换为 ","，用于分隔不同的键值对。
      .replace(/=/g, '":"') +     //将 = 替换为 ":"，用于分隔键和值
    '"}'
  )
}

let List = []
const count = 200
//模拟200条用户数据
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),           //生成一个全局唯一标识符（GUID）作为用户的 id
      name: Mock.Random.cname(),        //生成一个随机的中文姓名作为用户的 name
      addr: Mock.mock('@county(true)'), //生成一个随机的县名作为用户的地址 addr
      'age|18-60': 1,                   //生成一个 18 到 60 之间的随机整数作为用户的年龄 age
      birth: Mock.Random.date(),        //生成一个随机的日期作为用户的生日 birth
      sex: Mock.Random.integer(0, 1)    //生成一个 0 或 1 的随机整数作为用户的性别 sex
    })
  )
}


export default {
  /**
   * 获取列表
   * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
   * @param name, page, limit
   * @return {{code: number, count: number, data: *[]}}
   * filter 是数组的一个方法，用于创建一个新数组，其中包含所有满足指定条件的元素。
   */
  getUserList: config => {
    //limit默认是10，因为分页器默认也是一页10个
    //config.url=https://apifoxmock.com/m1/4068509-0-default/api/home/getUserData?name=&total=0&page=1
    const { name, page = 1, limit = 10 } = param2Obj(config.url)
    const mockList = List.filter(user => {
      //如果name存在会，根据name筛选数据
      if (name && user.name.indexOf(name) === -1) return false //如果 name 存在且用户的姓名中不包含 name，则返回 false，表示不保留该用户。
      return true   //否则，返回 true，表示保留该用户。
    })
    //分页
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1)) //使用 filter 方法对筛选后的数据进行分页处理 保留这个区间的数据

    return {
      code: 200,
      data: {
        list: pageList,
        count: mockList.length, //数据总条数需要返回
      }
    }
  },
  /**
    * 删除用户
    * @param id
    * @return {*}
    */
  deleteUser: config => {
    const { id } = param2Obj(config.url)

    if (!id) {
      return {
        code: -999,
        message: '参数不正确'
      }
    } else {
      List = List.filter(u => u.id !== id)
      return {
        code: 200,
        message: '删除成功'
      }
    }
  },
  /**
   * 增加用户
   * @param name, addr, age, birth, sex
   * @return {{code: number, data: {message: string}}}
   */
  createUser: config => {
    const { name, addr, age, birth, sex } = JSON.parse(config.body)
    List.unshift({
      id: Mock.Random.guid(),
      name: name,
      addr: addr,
      age: age,
      birth: birth,
      sex: sex
    })
    return {
      code: 200,
      data: {
        message: '添加成功'
      }
    }
  },
  /**
   * 修改用户
   * @param id, name, addr, age, birth, sex
   * @return {{code: number, data: {message: string}}}
   */
  updateUser: config => {
    const { id, name, addr, age, birth, sex } = JSON.parse(config.body)
    const sex_num = parseInt(sex)
    List.some(u => {
      if (u.id === id) {
        u.name = name
        u.addr = addr
        u.age = age
        u.birth = birth
        u.sex = sex_num
        return true
      }
    })
    return {
      code: 200,
      data: {
        message: '编辑成功'
      }
    }
  }
}