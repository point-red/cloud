(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-080fadec"],{"19c6":function(t,e,s){"use strict";s("b0c0");var a=function(){var t=this,e=t._self._c;return e("sweet-modal",{ref:"modal",attrs:{title:t._f("uppercase")("Select Sales Order"),"overlay-theme":"dark"},on:{close:function(e){return t.onClose()}}},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.searchText,expression:"searchText"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Search..."},domProps:{value:t.searchText},on:{keydown:function(e){if(!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter"))return null;e.preventDefault()},input:function(e){e.target.composing||(t.searchText=e.target.value)}}}),e("hr"),t.isLoading?e("div",[e("h3",{staticClass:"text-center"},[t._v(" Loading ... ")])]):e("div",{staticClass:"list-group push"},t._l(t.options,(function(s,a){return e("a",{key:"sales-order-"+a,staticClass:"list-group-item list-group-item-action",attrs:{href:"javascript:void(0)"},on:{click:function(e){return t.choose(s)}}},[e("div",{staticClass:"d-flex justify-content-between align-items-center"},[e("div",[e("strong",[t._v(t._s(s.form.number))])]),e("div",{staticClass:"text-black-50 text-right",staticStyle:{"font-size":"0.8em"}},[t._v(" Created by "+t._s(s.form.created_by.name)),e("br"),t._v(" "+t._s(t._f("dateFormat")(s.form.created_at,"DD MMMM YYYY HH:mm"))+" ")])]),e("table",{staticClass:"table mb-0",staticStyle:{"font-size":"11px"}},t._l(s.items,(function(s,a){return e("tr",{key:"item-"+a},[e("td",{staticClass:"pl-0"},[t._v(" "+t._s(s.item.name)+" ")]),e("td",{staticClass:"w-1 text-right text-nowrap"},[t._v(" "+t._s(s.quantity)+" "+t._s(s.unit)+" ")])])})),0)])})),0),t.searchText&&0==t.options.length&&!t.isLoading?e("div",{staticClass:"alert alert-info text-center"},[t._v(" "+t._s(t._f("capitalize")(t.$t("searching not found",[t.searchText])))+" ")]):t._e(),e("div",{staticClass:"pull-right"},[e("button",{staticClass:"btn btn-sm btn-outline-danger",attrs:{type:"button"},on:{click:function(e){return t.clear()}}},[t._v(" "+t._s(t._f("uppercase")(t.$t("clear")))+" ")])])])},r=[],o=s("5530"),n=(s("a9e3"),s("ac1f"),s("841c"),s("d3b7"),s("b047")),i=s.n(n),l=s("2f62"),c={props:{id:{type:String,default:""},value:{type:[String,Number],default:""}},data:function(){return{index:null,searchText:"",options:[],selected:{},isLoading:!1}},computed:Object(o["a"])({},Object(l["c"])("masterItem",["items","pagination"])),watch:{searchText:i()((function(){this.search()}),300)},methods:Object(o["a"])(Object(o["a"])({},Object(l["b"])("salesOrder",["get"])),{},{search:function(){var t=this;this.isLoading=!0,this.get({params:{join:"form,items,item,customer",fields:"sales_order.*",sort_by:"-form.number",group_by:"form.id",filter_form:"activePending;approvalApproved",filter_not_null:"form.number",includes:"items.item.units;customer;form.createdBy"}}).then((function(e){t.options=e.data})).finally((function(){t.isLoading=!1}))},clear:function(t){this.$emit("choosen",{id:null,form:{number:null}}),this.close()},choose:function(t){this.$emit("choosen",t),this.close()},open:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.index=t,this.search(),this.$refs.modal.open()},close:function(){this.$refs.modal.close()},onClose:function(){this.$emit("close",!0)}})},m=c,d=(s("50b8"),s("2877")),u=Object(d["a"])(m,a,r,!1,null,"bfc85f02",null);e["a"]=u.exports},"208e":function(t,e,s){"use strict";var a=function(){var t=this,e=t._self._c;return e("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/sales"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("sales")))+" ")])},r=[],o=s("2877"),n={},i=Object(o["a"])(n,a,r,!1,null,null,null);e["a"]=i.exports},"2b0d":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t._self._c;return e("div",[e("breadcrumb",[e("breadcrumb-sales"),e("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/sales/down-payment"}},[t._v(" "+t._s(t._f("titlecase")(t.$t("down payment")))+" ")]),e("span",{staticClass:"breadcrumb-item active"},[t._v("Create")])],1),e("sales-menu"),e("form",{on:{submit:function(e){return e.preventDefault(),t.onSubmit.apply(null,arguments)}}},[e("div",{staticClass:"row"},[e("p-block",[e("p-block-inner",{attrs:{"is-loading":t.isLoading}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-6"},[e("h4",[t._v(t._s(t._f("uppercase")(t.$t("down payment"))))]),e("table",{staticClass:"table table-sm table-bordered"},[e("tr",[e("td",{staticClass:"font-weight-bold"},[t._v(" "+t._s(t._f("uppercase")(t.$t("form number")))+" ")]),e("td",[t._v(" "+t._s(t.downPayment.form.number)+" ")])]),e("tr",[e("td",{staticClass:"font-weight-bold"},[t._v(" "+t._s(t._f("uppercase")(t.$t("date")))+" ")]),e("td",[e("p-date-picker",{attrs:{id:"date",name:"date",label:t.$t("date"),errors:t.form.errors.get("date")},on:{errors:function(e){return t.form.errors.set("date",null)}},model:{value:t.form.date,callback:function(e){t.$set(t.form,"date",e)},expression:"form.date"}})],1)]),e("tr",[e("td",{staticClass:"font-weight-bold"},[t._v(" "+t._s(t._f("uppercase")(t.$t("reference")))+" ")]),e("td",[t._v(" "+t._s(t.downPayment.downpaymentable.form.number)+" ")])]),e("tr",[e("td",{staticClass:"font-weight-bold"},[t._v(" "+t._s(t._f("uppercase")(t.$t("amount")))+" ")]),e("td",[e("p-form-number",{attrs:{id:"amount",name:"amount","is-text-right":!1,max:t.downPayment.amount?t.downPayment.amount:0},model:{value:t.form.amount,callback:function(e){t.$set(t.form,"amount",t._n(e))},expression:"form.amount"}})],1)])])]),e("div",{staticClass:"col-sm-6 text-right"},[e("div",{staticClass:"mb-30"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.authUser.tenant_name))+" ")]),t.authUser.branch?[t._v(" "+t._s(t._f("uppercase")(t.authUser.branch.address))+" "),t.authUser.branch.address?e("br"):t._e(),t._v(" "+t._s(t._f("uppercase")(t.authUser.branch.phone))+" "),t.authUser.branch.phone?e("br"):t._e()]:t._e()],2),e("div",[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("from")))+": "+t._s(t._f("uppercase")(t.form.customer_label))+" ")]),t.form.customer_address?e("div",[e("i",{staticClass:"fa fa-home fa-fw"}),t._v(" "+t._s(t._f("uppercase")(t.form.customer_address))+" ")]):t._e(),t.form.customer_phone?e("div",[e("i",{staticClass:"fa fa-phone fa-fw"}),t._v(" "+t._s(t._f("uppercase")(t.form.customer_phone))+" ")]):t._e()])])]),e("hr"),e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-12"},[e("point-table",{staticClass:"mt-20"},[e("tr",{attrs:{slot:"p-head"},slot:"p-head"},[e("th",{staticClass:"text-center"},[t._v(" # ")]),e("th",[t._v("Item")]),e("th",{staticClass:"text-right"},[t._v(" Quantity ")]),e("th",{staticClass:"text-right"},[t._v(" Price ")]),e("th",{staticClass:"text-right"},[t._v(" Discount ")]),e("th",{staticClass:"text-right"},[t._v(" Total ")]),e("th",{attrs:{width:"50px"}})]),t._l(t.downPayment.downpaymentable.items,(function(s,a){return[e("tr",{key:a,attrs:{slot:"p-body"},slot:"p-body"},[e("th",{staticClass:"text-center"},[t._v(" "+t._s(a+1)+" ")]),e("td",[t._v(t._s(s.item.label))]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(s.quantity))+" "+t._s(s.unit)+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(s.price))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(s.discount_value))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(s.quantity*(s.price-s.discount_value)))+" ")]),e("td")])]})),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("uppercase")(t.$t("subtotal"))))])]),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("numberFormat")(t.subtotal)))])]),e("td")]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("uppercase")(t.$t("discount"))))])]),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("numberFormat")(t.downPayment.downpaymentable.discount_value)))])]),e("td")]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("uppercase")(t.$t("tax base"))))])]),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("numberFormat")(t.downPayment.downpaymentable.amount-t.downPayment.downpaymentable.tax)))])]),e("td")]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("uppercase")(t.$t("tax"))))])]),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("numberFormat")(t.downPayment.downpaymentable.tax)))])]),e("td")]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("uppercase")(t.$t("total"))))])]),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("numberFormat")(t.downPayment.downpaymentable.amount)))])]),e("td")])],2)],1)]),e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-6"},[e("textarea",{directives:[{name:"model",rawName:"v-model",value:t.form.notes,expression:"form.notes"}],staticClass:"form-control",attrs:{rows:"5",placeholder:"Notes"},domProps:{value:t.form.notes},on:{input:function(e){e.target.composing||t.$set(t.form,"notes",e.target.value)}}})]),e("div",{staticClass:"col-sm-3 text-center"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("requested by")))+" ")]),e("div",{staticClass:"mb-50",staticStyle:{"font-size":"11px"}},[t._v(" "+t._s(t._f("dateFormat")(Date.now(),"DD MMMM YYYY"))+" ")]),t._v(" "+t._s(t._f("uppercase")(t.requestedBy))+" "),e("div",{staticClass:"d-sm-block d-md-none mt-10"})]),e("div",{staticClass:"col-sm-3 text-center"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("approved by")))+" ")]),e("div",{staticClass:"mb-50",staticStyle:{"font-size":"11px"}},[t._v(" _______________ ")]),e("span",{staticClass:"select-link",on:{click:function(e){return t.$refs.approver.open()}}},[t._v(t._s(t._f("uppercase")(t.form.approver_name||t.$t("select"))))]),e("br"),e("span",{staticStyle:{"font-size":"9px"}},[t._v(t._s(t._f("uppercase")(t.form.approver_email)))])]),e("div",{staticClass:"col-sm-12"},[e("hr"),e("button",{staticClass:"btn btn-block btn-sm btn-primary",attrs:{type:"submit",disabled:t.isSaving}},[e("i",{directives:[{name:"show",rawName:"v-show",value:t.isSaving,expression:"isSaving"}],staticClass:"fa fa-asterisk fa-spin"}),t._v(" "+t._s(t._f("uppercase")(t.$t("save")))+" ")])])])])],1)],1)]),e("m-user",{ref:"approver",on:{choosen:t.chooseApprover}}),e("select-sales-order",{ref:"selectSalesOrder",on:{choosen:t.chooseSalesOrder}})],1)},r=[],o=s("5530"),n=(s("13d5"),s("d3b7"),s("7db0"),s("14d9"),s("bea4")),i=s("5ae6"),l=s("208e"),c=s("b7ae"),m=s("feee"),d=s("19c6"),u=s("2f62"),_={components:{SalesMenu:n["a"],PointTable:m["a"],Breadcrumb:i["a"],BreadcrumbSales:l["a"],SelectSalesOrder:d["a"]},data:function(){return{id:this.$route.params.id,isSaving:!1,isLoading:!1,requestedBy:localStorage.getItem("fullName"),form:new c["a"]({id:this.$route.params.id,increment_group:this.$moment().format("YYYYMM"),date:this.$moment().format("YYYY-MM-DD HH:mm:ss"),sales_order_id:null,customer_id:null,customer_name:null,customer_label:null,customer_address:null,customer_phone:null,customer_email:null,notes:null,amount:null,request_approval_to:null,approver_name:null,approver_email:null})}},computed:Object(o["a"])(Object(o["a"])(Object(o["a"])({},Object(u["c"])("salesDownPayment",{downPayment:"downPayment"})),Object(u["c"])("auth",["authUser"])),{},{subtotal:function(){return this.downPayment.downpaymentable.items.reduce((function(t,e){return t+e.quantity*(e.price-e.discount_value)}),0)}}),created:function(){this.salesDownPaymentRequest()},methods:Object(o["a"])(Object(o["a"])(Object(o["a"])({},Object(u["b"])("salesDownPayment",["find","update"])),Object(u["b"])("salesOrder",{getSalesOrder:"find"})),{},{salesDownPaymentRequest:function(){var t=this;this.isLoading=!0,this.find({id:this.id,params:{with_archives:!0,with_origin:!0,includes:"customer;downpaymentable.form;downpaymentable.items.item;form.createdBy;form.requestApprovalTo;form.branch"}}).then((function(e){t.form.sales_order_id=t.downPayment.downpaymentable_id,t.form.customer_id=t.downPayment.customer_id,t.form.customer_name=t.downPayment.customer_name,t.form.customer_label=t.downPayment.customer_name,t.form.customer_phone=t.downPayment.customer_phone,t.form.notes=t.downPayment.notes,t.form.amount=t.downPayment.amount,t.form.request_approval_to=t.downPayment.form.request_approval_to.id,t.form.approver_name=t.downPayment.form.request_approval_to.full_name,t.form.approver_email=t.downPayment.form.request_approval_to.email,t.setSalesOrder()})).catch((function(e){t.$notification.error(e.message)})).finally((function(){t.isLoading=!1}))},setSalesOrder:function(){var t=this;this.getSalesOrder({id:this.form.sales_order_id,params:{with_archives:!0,with_origin:!0,includes:"form;items.item"}}).then((function(e){t.chooseSalesOrder(e.data)}))},chooseSalesOrder:function(t){this.salesOrder=t,this.form.sales_order_id=t.id,this.form.customer_id=this.salesOrder.customer_id,this.form.customer_name=this.salesOrder.customer_name,this.form.customer_label=this.salesOrder.customer_name},chooseApprover:function(t){this.form.request_approval_to=t.id,this.form.approver_name=t.fullName,this.form.approver_email=t.email},onSubmit:function(){var t=this;if(this.isSaving=!0,null==this.form.request_approval_to)return this.$notification.error("approval cannot be null"),this.isSaving=!1,void this.form.errors.record({request_approval_to:["Approver should not empty"]});this.form.increment_group=this.$moment(this.form.date).format("YYYYMM"),this.update(this.form).then((function(e){t.isSaving=!1,t.$notification.success("update success"),Object.assign(t.$data,t.$options.data.call(t)),t.$router.push("/sales/down-payment/"+e.data.id)})).catch((function(e){t.isSaving=!1,t.$notification.error(e.message),t.form.errors.record(e.errors)}))}})},p=_,f=s("2877"),h=Object(f["a"])(p,a,r,!1,null,null,null);e["default"]=h.exports},"50b8":function(t,e,s){"use strict";s("c139")},c139:function(t,e,s){}}]);
//# sourceMappingURL=chunk-080fadec.e8fd718e.js.map