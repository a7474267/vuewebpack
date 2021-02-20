<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openCoupon(true)">建立新的優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th width="200">折扣百分比</th>
          <th width="200">到期日</th>
          <th width="200">是否啟用</th>
          <th width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
          <tr v-for="item in coupons" :key="item.id">
              <td>{{item.title}}</td>
              <td>{{item.percent}}%</td>
              <td>{{item.due_date | date}}</td>
              <td>
                  <span v-if="item.is_enabled" class="text-success">啟用</span>
                  <span v-else>未啟用</span>
              </td>
              <td>
                  <button class="btn btn-outline-primary btn-sm" @click="openCoupon(false,item,false)">編輯</button>
                  <button class="btn btn-outline-danger btn-sm" @click="openCoupon(false,item,true)">刪除</button>
              </td>
          </tr>
      </tbody>
    </table>
    <Pagination :pages="pagination" @set-page="getCoupon"></Pagination>
    <!-- coupon modal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-12">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入標題"
                    v-model.trim="tempCoupon.title"
                  />
                </div>
                <div class="form-group">
                  <label for="code">優惠碼</label>
                  <input
                    type="text"
                    class="form-control"
                    id="code"
                    placeholder="請輸入優惠碼"
                    v-model="tempCoupon.code"
                  />
                </div>
                <div class="form-group">
                  <label for="expired">到期日</label>
                  <input
                    type="date"
                    class="form-control"
                    id="expired"
                    placeholder="請輸入到期日"
                    v-model="due_date"
                  />
                </div>
                <hr />

                <div class="form-group">
                  <label for="percentage">折扣百分比</label>
                  <input
                    type="text"
                    class="form-control"
                    id="percentage"
                    placeholder="請輸入百分比"
                    v-model.number="tempCoupon.percent"
                  />
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="tempCoupon.is_enabled"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="updateCoupon">更新優惠券</button>
          </div>
        </div>
      </div>
    </div>
    <!-- delete coupon modal -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Pagination from '../Pagination'
export default {
  data () {
    return {
      isNew: false,
      coupons: [],
      tempCoupon: {},
      due_date: new Date(),
      pagination: {},
      isLoading: false
    }
  },
  components: {
    Pagination
  },
  watch: {
    due_date () {
      const vm = this
      const timestamp = Math.floor(new Date(vm.due_date).getTime() / 1000)
      vm.tempCoupon.due_date = timestamp
    }
  },
  methods: {
    getCoupon (page = 1) {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`
      const vm = this
      vm.isLoading = true
      vm.$http.get(api).then(function (res) {
        vm.coupons = res.data.coupons
        vm.pagination = res.data.pagination
        vm.isLoading = false
      })
    },
    openCoupon (isNew, item, clear) {
      const vm = this
      if (clear) {
        this.tempCoupon = Object.assign({}, item)
        $('#delCouponModal').modal('show')
        return
      }
      $('#couponModal').modal('show')
      if (isNew) {
        vm.tempCoupon = {}
        vm.isNew = true
      } else {
        vm.isNew = false
        vm.tempCoupon = Object.assign({}, item)
        const dateAndTime = new Date(vm.tempCoupon.due_date * 1000).toISOString().split('T')
        // const dateAndTime = new Date(vm.tempCoupon.due_date * 1000)
        console.log(dateAndTime)
        vm.due_date = dateAndTime[0]
      }
    },
    deleteCoupon () {
      let vm = this
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`
      vm.$http.delete(api).then(function (res) {
        if (res.data.success) {
          $('#delCouponModal').modal('hide')
          vm.getCoupon()
        } else {
          $('#delCouponModal').modal('hide')
          vm.getCoupon()
        }
      })
    },
    updateCoupon () {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`
      const vm = this
      let httpMethod = 'post'
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`
        httpMethod = 'put'
      }
      this.$http[httpMethod](api, {data: vm.tempCoupon}).then(function (res) {
        if (res.data.success) {
          $('#couponModal').modal('hide')
          vm.getCoupon()
        } else {
          $('#couponModal').modal('hide')
          vm.getCoupon()
        }
      })
    }
  },
  created () {
    this.getCoupon()
  }
}
</script>
