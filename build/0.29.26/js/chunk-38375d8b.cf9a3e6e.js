(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-38375d8b"],{"055b":function(t,e,s){"use strict";var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"d-flex flex-nowrap",staticStyle:{"overflow-x":"auto"}},[e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/request")},attrs:{to:"/purchase/request","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("purchase request"))))])]),e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/order")},attrs:{to:"/purchase/order","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("purchase order"))))])]),e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/down-payment")},attrs:{to:"/purchase/down-payment","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("down payment"))))])]),e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/receive")},attrs:{to:"/purchase/receive","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("purchase receive"))))])]),e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/invoice")},attrs:{to:"/purchase/invoice","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("purchase invoice"))))])]),e("router-link",{staticClass:"btn mr-5 mb-15",class:{"btn-secondary":!t.isMatch("/purchase/payment-order")},attrs:{to:"/purchase/payment-order","active-class":"btn-primary"}},[e("span",[t._v(t._s(t._f("uppercase")(t.$t("payment order"))))])])],1)},c=[],r={data:function(){return{path:this.$route.path}},methods:{isMatch:function(t){return this.path.substring(0,t.length)==t}}},i=r,o=s("2877"),n=Object(o["a"])(i,a,c,!1,null,null,null);e["a"]=n.exports},"861c":function(t,e,s){"use strict";var a=function(){var t=this,e=t._self._c;return e("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/purchase"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("purchase")))+" ")])},c=[],r=s("2877"),i={},o=Object(r["a"])(i,a,c,!1,null,null,null);e["a"]=o.exports},9594:function(t,e,s){"use strict";s.r(e);s("b0c0");var a=function(){var t=this,e=t._self._c;return e("div",[t.purchaseInvoice?e("breadcrumb",[e("breadcrumb-purchase"),e("router-link",{staticClass:"breadcrumb-item",attrs:{to:"/purchase/invoice"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("purchase invoice")))+" ")]),e("span",{staticClass:"breadcrumb-item active"},[t._v(t._s(t._f("uppercase")(t.purchaseInvoice.form.number)))])],1):t._e(),e("purchase-menu"),e("p-show-form-approval-status",{attrs:{"is-loading":t.isLoading,"approved-by":t.purchaseInvoice.form.request_approval_to.full_name,"cancellation-status":t.purchaseInvoice.form.cancellation_status,"approval-status":t.purchaseInvoice.form.approval_status,"approval-reason":t.purchaseInvoice.form.approval_reason},on:{onApprove:t.onApprove,onReject:t.onReject}}),e("p-show-form-cancellation-status",{attrs:{"is-loading":t.isLoading,"cancellation-status":t.purchaseInvoice.form.cancellation_status,"cancellation-approval-reason":t.purchaseInvoice.form.cancellation_approval_reason,"request-cancellation-reason":t.purchaseInvoice.form.request_cancellation_reason},on:{onCancellationApprove:t.onCancellationApprove,onCancellationReject:t.onCancellationReject}}),t.purchaseInvoice?e("div",{staticClass:"row"},[e("p-block",[e("p-block-inner",{attrs:{"is-loading":t.isLoading}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-12"},[e("div",{staticClass:"text-right"},[e("router-link",{staticClass:"btn btn-sm btn-outline-secondary mr-5",attrs:{to:{name:"purchase.invoice.create"}}},[t._v(" "+t._s(t._f("uppercase")(t.$t("create")))+" ")]),null==t.purchaseInvoice.form.cancellation_status||-1==t.purchaseInvoice.form.cancellation_status?e("button",{staticClass:"btn btn-sm btn-outline-secondary mr-5",on:{click:function(e){return t.$refs.formRequestDelete.open()}}},[t._v(" "+t._s(t._f("uppercase")(t.$t("delete")))+" ")]):t._e(),e("m-form-request-delete",{ref:"formRequestDelete",on:{delete:function(e){return t.onDelete(e)}}})],1)])]),e("hr"),e("div",{staticClass:"row"},[e("div",{staticClass:"col-sm-6"},[e("h4",[t._v(t._s(t._f("uppercase")(t.$t("purchase invoice"))))]),e("table",{staticClass:"table table-sm table-bordered"},[e("tr",[e("td",{staticClass:"font-weight-bold",attrs:{width:"150px"}},[t._v(" "+t._s(t._f("uppercase")(t.$t("form number")))+" ")]),e("td",[t._v(t._s(t.purchaseInvoice.form.number))])]),e("tr",[e("td",{staticClass:"font-weight-bold"},[t._v(" "+t._s(t._f("uppercase")(t.$t("date")))+" ")]),e("td",[t._v(t._s(t._f("dateFormat")(t.purchaseInvoice.date,"DD MMMM YYYY")))])])])]),e("div",{staticClass:"col-sm-6 text-right"},[e("h6",{staticClass:"mb-5"},[t._v(" "+t._s(t._f("uppercase")(t.authUser.tenant_name))+" ")]),t.purchaseInvoice.form.branch?[t._v(" "+t._s(t._f("uppercase")(t.purchaseInvoice.form.branch.address))+" "),t.purchaseInvoice.form.branch.phone?e("br"):t._e(),t._v(t._s(t._f("uppercase")(t.purchaseInvoice.form.branch.phone))+" ")]:t._e(),e("h6",{staticClass:"mt-30 mb-5"},[t._v(" "+t._s(t._f("uppercase")(t.$t("supplier")))+" ")]),t._v(" "+t._s(t._f("uppercase")(t.purchaseInvoice.supplier_name))+" "),e("div",{staticStyle:{"font-size":"12px"}},[t._v(" "+t._s(t._f("uppercase")(t.purchaseInvoice.supplier_address))+" "),t.purchaseInvoice.supplier_phone?e("br"):t._e(),t._v(t._s(t.purchaseInvoice.supplier_phone)+" "),t.purchaseInvoice.supplier_email?e("br"):t._e(),t._v(t._s(t._f("uppercase")(t.purchaseInvoice.supplier_email))+" ")])],2)]),e("hr"),e("point-table",{staticClass:"mt-20"},[e("tr",{attrs:{slot:"p-head"},slot:"p-head"},[e("th",{staticClass:"text-center"},[t._v(" # ")]),e("th",[t._v("Item")]),e("th",{staticClass:"text-right"},[t._v(" Quantity ")]),e("th",{staticClass:"text-right"},[t._v(" Price ")]),e("th",{staticClass:"text-right"},[t._v(" Discount ")]),e("th",{staticClass:"text-right"},[t._v(" Total ")]),e("th",{attrs:{width:"50px"}},[e("button",{staticClass:"btn btn-sm btn-outline-secondary",attrs:{type:"button"},on:{click:function(e){return t.toggleMore()}}},[e("i",{staticClass:"fa fa-ellipsis-h"})])])]),t._l(t.purchaseInvoice.items,(function(s,a){return[e("tr",{key:a,attrs:{slot:"p-body"},slot:"p-body"},[e("th",{staticClass:"text-center"},[t._v(" "+t._s(a+1)+" ")]),e("td",[t._v(t._s(s.item.label))]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(s.quantity))+" "+t._s(s.unit)+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(s.price))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(s.discount_value))+" ")]),e("td",{staticClass:"text-right"},[t._v(" "+t._s(t._f("numberFormat")(s.quantity*(s.price-s.discount_value)))+" ")]),e("td",[e("button",{staticClass:"btn btn-sm btn-outline-secondary",attrs:{type:"button"},on:{click:function(t){s.more=!s.more}}},[e("i",{staticClass:"fa fa-ellipsis-h"})])])]),s.more?[e("tr",{key:"ext-"+a,staticClass:"bg-gray-light",attrs:{slot:"p-body"},slot:"p-body"},[e("th",{staticClass:"bg-gray-light"}),e("td",{attrs:{colspan:"6"}},[e("p-form-row",{staticClass:"mb-0",attrs:{id:"allocation-"+a,name:"allocation-"+a,label:t.$t("allocation")}},[e("div",{staticClass:"mt-5",attrs:{slot:"body"},slot:"body"},[s.allocation?[t._v(" "+t._s(s.allocation.name)+" ")]:t._e()],2)])],1)]),e("tr",{key:"ext2-"+a,staticClass:"bg-gray-light",attrs:{slot:"p-body"},slot:"p-body"},[e("th",{staticClass:"bg-gray-light"}),e("td",{attrs:{colspan:"6"}},[e("p-form-row",{staticClass:"mb-0",attrs:{id:"notes-"+a,name:"notes-"+a,label:t.$t("notes")}},[e("div",{staticClass:"mt-5",attrs:{slot:"body"},slot:"body"},[t._v(" "+t._s(s.notes)+" ")])])],1)])]:t._e()]})),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("uppercase")(t.$t("subtotal"))))])]),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("numberFormat")(t.purchaseInvoice.subtotal)))])]),e("td")]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("uppercase")(t.$t("discount"))))])]),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("numberFormat")(t.purchaseInvoice.discount_value)))])]),e("td")]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("uppercase")(t.$t("tax base"))))])]),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("numberFormat")(t.purchaseInvoice.amount-t.purchaseInvoice.tax)))])]),e("td")]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("uppercase")(t.$t("tax"))))])]),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("numberFormat")(t.purchaseInvoice.tax)))])]),e("td")]),e("tr",{attrs:{slot:"p-body"},slot:"p-body"},[e("th"),e("td"),e("td"),e("td"),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("uppercase")(t.$t("total"))))])]),e("td",{staticClass:"text-right"},[e("b",[t._v(t._s(t._f("numberFormat")(t.purchaseInvoice.amount)))])]),e("td")])],2),e("div",{staticClass:"row mt-50"},[e("div",{staticClass:"col-sm-6"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("notes")))+" ")]),e("div",{staticStyle:{"white-space":"pre-wrap"}},[t._v(" "+t._s(t.purchaseInvoice.form.notes)+" ")]),e("div",{staticClass:"d-sm-block d-md-none mt-10"})]),e("div",{staticClass:"col-sm-3 text-center"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("requested by")))+" ")]),e("div",{staticClass:"mb-50",staticStyle:{"font-size":"11px"}},[t._v(" "+t._s(t._f("dateFormat")(t.purchaseInvoice.form.date,"DD MMMM YYYY"))+" ")]),t._v(" "+t._s(t._f("uppercase")(t.purchaseInvoice.form.created_by.full_name))+" "),e("div",{staticClass:"d-sm-block d-md-none mt-10"})]),e("div",{staticClass:"col-sm-3 text-center"},[e("h6",{staticClass:"mb-0"},[t._v(" "+t._s(t._f("uppercase")(t.$t("approved by")))+" ")]),e("div",{staticClass:"mb-50",staticStyle:{"font-size":"11px"}},[t.purchaseInvoice.form.approval_at?[t._v(" "+t._s(t._f("dateFormat")(t.purchaseInvoice.form.approval_at,"DD MMMM YYYY"))+" ")]:[t._v(" _______________ ")]],2),t._v(" "+t._s(t._f("uppercase")(t.purchaseInvoice.form.request_approval_to.full_name))+" "),e("div",{staticStyle:{"font-size":"11px"}},[t._v(" "+t._s(t._f("lowercase")(t.purchaseInvoice.form.request_approval_to.email))+" ")])])])],1)],1)],1):t._e(),e("m-form-request-delete",{ref:"formRequestDelete",on:{delete:function(e){return t.onDelete(e)}}})],1)},c=[],r=s("5530"),i=(s("d3b7"),s("159b"),s("7db0"),s("14d9"),s("055b")),o=s("5ae6"),n=s("861c"),l=s("feee"),p=s("2f62"),u={components:{PurchaseMenu:i["a"],Breadcrumb:o["a"],BreadcrumbPurchase:n["a"],PointTable:l["a"]},data:function(){return{id:this.$route.params.id,isLoading:!1,isDeleting:!1}},computed:Object(r["a"])(Object(r["a"])({},Object(p["c"])("purchaseInvoice",["purchaseInvoice"])),Object(p["c"])("auth",["authUser"])),watch:{$route:function(t,e){t.params.id!=e.params.id&&(this.id=t.params.id,this.purchaseInvoiceRequest())}},created:function(){this.purchaseInvoiceRequest()},methods:Object(r["a"])(Object(r["a"])({},Object(p["b"])("purchaseInvoice",{find:"find",delete:"delete",approve:"approve",reject:"reject",cancellationApprove:"cancellationApprove",cancellationReject:"cancellationReject"})),{},{toggleMore:function(){var t=this.purchaseInvoice.items.some((function(t,e){return!1===t.more}));this.purchaseInvoice.items.forEach((function(e){e.more=t}))},purchaseInvoiceRequest:function(){var t=this;this.isLoading=!0,this.find({id:this.id,params:{with_archives:!0,with_origin:!0,includes:"supplier;items.item;items.allocation;form.createdBy;form.requestApprovalTo;form.branch"}}).then((function(e){t.calculate()})).catch((function(e){t.$notification.error(e.message)})).finally((function(){t.isLoading=!1}))},calculate:function(){var t=0;this.purchaseInvoice.items.forEach((function(e){e.discount_percent>0?e.total=e.quantity*(e.price-e.price*e.discount_percent/100):e.discount_value>0?e.total=e.quantity*(e.price-e.discount_value):e.total=e.quantity*e.price,t+=parseFloat(e.total)})),this.purchaseInvoice.subtotal=t},onDelete:function(t){var e=this;this.isDeleting=!0,this.delete({id:this.id,data:{reason:t}}).then((function(t){e.isDeleting=!1,e.$notification.success("cancel success"),e.purchaseInvoiceRequest()})).catch((function(t){e.isDeleting=!1,e.$notification.error(t.message),e.form.errors.record(t.errors)}))},onApprove:function(){var t=this;this.approve({id:this.id}).then((function(e){t.$notification.success("approve success"),t.purchaseInvoiceRequest()}))},onReject:function(t){var e=this;this.reject({id:this.id,reason:t}).then((function(t){e.$notification.success("reject success"),e.purchaseInvoiceRequest()}))},onCancellationApprove:function(){var t=this;this.cancellationApprove({id:this.id}).then((function(e){t.$notification.success("cancellation approved"),t.$router.push("/purchase/invoice")}))},onCancellationReject:function(t){var e=this;this.cancellationReject({id:this.id,reason:t}).then((function(t){e.$notification.success("cancellation rejected"),e.purchaseInvoiceRequest()})).catch((function(t){console.log(t.message)}))}})},_=u,h=s("2877"),d=Object(h["a"])(_,a,c,!1,null,null,null);e["default"]=d.exports}}]);
//# sourceMappingURL=chunk-38375d8b.cf9a3e6e.js.map