/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ui.comp.valuehelpdialog.ValueHelpDialog");
jQuery.sap.require("sap.ui.comp.filterbar.FilterBar");
jQuery.sap.require("mrs.resourcemanagement.Util.Constants");
jQuery.sap.require("mrs.resourcemanagement.Util.DataPreparation");
jQuery.sap.require("mrs.resourcemanagement.Util.Util");
jQuery.sap.require("mrs.resourcemanagement.Util.AssignmentWizard");
sap.ui.controller("mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.SelfBookingExistingProjectCustom", {
	onInit: function() {
		this.resourceBundle = mrs.resourcemanagement.Util.Util.getResourceBundle();
		this.utilConstant = mrs.resourcemanagement.Util.Constants;
		var c = mrs.resourcemanagement.Util.Util.getCurrentUser();
		mrs.resourcemanagement.Util.AssignmentWizard.setConsultantData(c, this);
		// this.oRowTemplate = this.byId("menuListId").getItems()[0].clone();
		// this.byId("menuListId").bindAggregation("items", {
		// 	path: "EmptyModel>/",
		// 	template: this.oRowTemplate
		// })
	},
	onBeforeRendering: function() {
		var t = new sap.ui.model.json.JSONModel();
		var s, S;
		this.getView().getModel().read("/EnableSelfBookReqSH", null, null, true, jQuery.proxy(function(r) {
			t.setData(r);
			if (t.getData().EnableSelfBookReqSH.SearchHelpEnable === "X") {
				s = true;
				S = false
			} else {
				s = false;
				S = true
			}
			this.byId("buttonRequestSelection").setVisible(s);
			this.byId("buttonRoleSelection").setVisible(s);
			this.byId("RequestName").setVisible(s);
			this.byId("RoleName").setVisible(s);
			this.byId("RoleNumberInput").setVisible(S);
			this.byId("RequestNumberInput").setVisible(S);
			this.byId("RequestNumber").setVisible(S);
			this.byId("RoleNumber").setVisible(S)
		}, this), function(e) {
			mrs.resourcemanagement.Util.Util.showErrorMessage(e)
		});
		this.byId("RoleNumberInput").setValue("");
		this.byId("RequestNumberInput").setValue("");
		this.byId("addAssignmentNextBtn1").setText(this.resourceBundle.getText("SELF_BOOKING_ASSIGNMENT_NEXT_BTN", ["1"]));
		// this.byId("addAssignmentNextBtn2").setText(this.resourceBundle.getText("SELF_BOOKING_ASSIGNMENT_NEXT_BTN", ["2"]));
		// this.byId("buttonRequestSelection").setText(this.resourceBundle.getText("TEAM_SCHEDULE_SELECT_ASSIGNMENT"));
		// this.byId("buttonRoleSelection").setText(this.resourceBundle.getText("TEAM_SCHEDULE_SELECT_ASSIGNMENT"));
		var n = this.byId("addAssigmentWizardNav");
		this.sRequestNumber = "";
		this.sRequestName = "";
		this.sRoleNumber = "";
		this.sRoleName = "";
		// this.byId("addAssignmentNextBtn2").setEnabled(false);
		// this.byId("buttonRoleSelection").setEnabled(false);
		n.backToTop()
	},
	onRequestRoleNumberInputChanged: function() {
		if (this.byId("RoleNumberInput").getValue() && this.byId("RequestNumberInput").getValue()) {
			this.byId("addAssignmentNextBtn1").setEnabled(true);
			this.sRoleNumber = this.byId("RoleNumberInput").getValue().toString();
			this.sRequestNumber = this.byId("RequestNumberInput").getValue().toString()
		} else {
			this.byId("addAssignmentNextBtn1").setEnabled(false)
		}
	},
	titleFormatter: function(a) {
		return mrs.resourcemanagement.Util.AssignmentWizard.titleFormatter(a, this)
	},
	descriptionFormatter: function(a) {
		return mrs.resourcemanagement.Util.AssignmentWizard.descriptionFormatter(a, this)
	},
	iconFormatter: function(a) {
		return mrs.resourcemanagement.Util.AssignmentWizard.iconFormatter(a, this)
	},
	customDataFormatter: function(a) {
		return mrs.resourcemanagement.Util.AssignmentWizard.customDataFormatter(a, this)
	},
	createConcreteAssignment: function() {
		var c = this.byId("concreteAssignment");
		mrs.resourcemanagement.Util.AssignmentWizard.createConcreteAssignment(c)
	},
	createCapacitiveAssignment: function() {
		var c = this.byId("capacitiveAssignment");
		mrs.resourcemanagement.Util.AssignmentWizard.createCapacitiveAssignment(c)
	},
	createStretchAssignment: function() {
		var s = this.byId("stretchedAssignment");
		mrs.resourcemanagement.Util.AssignmentWizard.createStretchAssignment(s)
	},
	createOtherAssignment: function() {
		var o = this.byId("otherBooking");
		mrs.resourcemanagement.Util.AssignmentWizard.createOtherAssignment(o)
	},
	DeleteAssignment: function(){
	var o = this.byId("otherBooking");
	mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateOtherBookingCustom.deleteAssignment(o);
	},
	onCancelPress: function() {
		mrs.resourcemanagement.Util.AssignmentWizard.onCancelPress(this)
	},
	onNavToNextPage: function() {
		// 	t.AssignmentModel.setProperty("/RequestNumber", t.sRequestNumber);
		// t.AssignmentModel.setProperty("/RequestName", t.sRequestName);
		// t.AssignmentModel.setProperty("/RoleNumber", t.sRoleNumber);
		// t.AssignmentModel.setProperty("/RoleName", t.sRoleName);
		// mrs.resourcemanagement.Util.AssignmentWizard.onNavToNextPage(this)
	},
	onNavToLastPage: function() {
		// var t = this;
		this.AssignmentModel.setProperty("/RequestNumber", this.sRequestNumber);
		this.AssignmentModel.setProperty("/RequestName", this.sRequestName);
		this.AssignmentModel.setProperty("/RoleNumber", this.sRoleNumber);
		this.AssignmentModel.setProperty("/RoleName", this.sRoleName);
		this.handleNav();
		// var n = this.byId("addAssigmentWizardNav");
		// var p = this.byId("concreteAssignmentPage");
		// n.to(p.getId(), "slide", null, null);
		// mrs.resourcemanagement.Util.AssignmentWizard.onNavToLastPage(this)
	},
	onSelectRequestPress: function(e) {
		var s = e.getSource();
		var c = new sap.ui.model.json.JSONModel();
		c.setData({
			cols: this._getValueHelpData()
		});
		var p = "/RequestSet";
		var t = this.resourceBundle.getText("TEAM_SCHEDULE_ASSIGNMENT_VALUEHELP_TITLE");
		this.showValueHelp(s, this.getView().getModel(), t, "RequestNumber", "RequestName", $.proxy(function(S, a, d) {
			this.byId("addAssignmentNextBtn1").setEnabled(false);
			this.sRequestNumber = S;
			this.sSPGroup = d.SPGroup;
			this.sRequestName = a;
			this.sRoleNumber = "";
			this.sRoleName = "";
			this.byId("buttonRequestSelection").setText(this.sRequestName + " (" + this.sRequestNumber + ")");
			this.byId("buttonRoleSelection").setText(this.resourceBundle.getText("TEAM_SCHEDULE_SELECT_ASSIGNMENT"));
			this.byId("buttonRoleSelection").setEnabled(true)
		}, this), c, p, this._getFilterItemsList(), this._getFilterGroupsList(), false)
	},
	onSelectRolePress: function(e) {
		mrs.resourcemanagement.Util.AssignmentWizard.onSelectRolePress(e, this)
	},
	_getValueHelpData: function() {
		return mrs.resourcemanagement.Util.AssignmentWizard._getValueHelpData()
	},
	_getFilterItemsList: function() {
		return mrs.resourcemanagement.Util.AssignmentWizard._getFilterItemsList()
	},
	_getFilterGroupsList: function() {
		return mrs.resourcemanagement.Util.AssignmentWizard._getFilterGroupsList()
	},
	_createPopoverTemplateAndData: function(p, f) {
		var v = this.getView();
		return mrs.resourcemanagement.Util.AssignmentWizard._createPopoverTemplateAndData(p, f, v, this)
	},
	onPopoverSelectionChange: function(e) {
		mrs.resourcemanagement.Util.AssignmentWizard.onPopoverSelectionChange(e)
	},
	onPopoverSelectRequestPress: function(e) {
		var b = this.byId("buttonRequestSelection");
		mrs.resourcemanagement.Util.AssignmentWizard.onPopoverSelectRequestPress(e, b)
	},
	onPopoverSelectRolePress: function(e) {
		mrs.resourcemanagement.Util.AssignmentWizard.onPopoverSelectRolePress(e, this)
	},
	handleNav: function() {
		var a = "concreteAssignment";
		if (a) {
			var t = this.getView().byId(a);
			this._handleCreateDefaultAssignment(t, this);
		}
	},
	handleBack: function() {
		var n = this.byId("addAssigmentWizardNav");
		mrs.resourcemanagement.Util.AssignmentWizard.handleBack(n)
	},
	_getMenuData: function() {
		mrs.resourcemanagement.Util.AssignmentWizard._getMenuData(this)
	},
    _handleCreateDefaultAssignment: function(t, a) {
		var v = a.getView();
		var p = "ConsultantID='" + a.sConsultantID + "'&RequestNumber='" + a.sRequestNumber + "'&RoleNumber='" + a.sRoleNumber + "'";
		var u = "/DefaultForAssignments";
		mrs.resourcemanagement.Util.Util.showBusyDialog();
		v.getModel().read(u + "?" + p, null, null, true, jQuery.proxy(function(r) {
			mrs.resourcemanagement.Util.Util.hideBusyDialog();
			var n = v.byId("addAssigmentWizardNav");
			if ((r.RequestNumber === "" || r.RoleNumber === "") && r.AssignmentType !== "O") {
				sap.m.MessageToast.show(a.resourceBundle.getText("ERROR"));
				v.getParent().close()
			}
			var b = mrs.resourcemanagement.Util.DataPreparation.prepareAssignmentsForDisplay(r);
			a.AssignmentModel.setData(b);
			t.setModel(a.CandidateModel, "CandidateModel");
			t.setModel(a.AssignmentModel, "AssignmentModel");
			t.getController().resetValidateStateInput();
			n.to(t.getId() + "Page", "slide", null, null)
		}, this), function(e) {
			mrs.resourcemanagement.Util.Util.hideBusyDialog();
			mrs.resourcemanagement.Util.Util.showErrorMessage(e)
		})
	},
	showValueHelp: function(s, m, t, k, d, S, c, b, f, F, M, D) {
		var a = d;
		if (D) {
			t = t + "(" + D.viewID + ")"
		}
		if (M) {
			sap.m.MessageToast.show(this.resourceBundle.getText("REQUEST_LOADING"))
		}
		var v = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
			title: t,
			modal: true,
			supportMultiselect: false,
			key: k,
			descriptionKey: d,
			ok: function(E) {
				var T = E.getParameter("tokens");
				if (T && T.length > 0) {
					var i = E.getSource().getTable().getContextByIndex(E.getSource().getTable().getSelectedIndex()).getObject();
					var l = T[0].getKey();
					var n = i[a];
					S(l, n, i, s)
				}
				v.close()
			},
			cancel: function() {
				v.close()
			},
			afterClose: function() {
				v.destroy()
			}
		});
		v.setModel(c, "columns");
		v.setModel(m);
		v.getTable().bindRows(b);
		var e = f;
		var o = null;
		var C = [];
		if (e && e.length > 0 && e[0].getControl() && typeof e[0].getControl().setShowSearchButton === "function") {
			o = e[0].getControl();
			$.each(e, $.proxy(function(i, O) {
				C.push(O.getControl())
			}, this));
			$.each(F, $.proxy(function(i, O) {
				C.push(O.getControl())
			}, this))
		}
		var u = new sap.ui.model.Filter("DisplayRequest", sap.ui.model.FilterOperator.EQ, true);
		var g = new sap.ui.comp.filterbar.FilterBar({
			advancedMode: true,
			filterItems: e,
			filterGroupItems: F,
			search: function(l) {
				var h = [];
				h.push(u);
				var n = l.getParameters().selectionSet;
				for (var i = 0; i < n.length; i++) {
					var p = n[i].getId();
					if (p && n[i].getValue() !== "") {
						h.push(new sap.ui.model.Filter(p, sap.ui.model.FilterOperator.Contains, n[i].getValue()))
					}
				}
				var B = v.getTable().getBinding("rows");
				var j = new sap.ui.model.Filter({
					filters: h,
					and: true
				});
				B.filter(j, sap.ui.model.FilterType.Application)
			}
		});
		v.setFilterBar(g);
		if (o) {
			o.attachSearch($.proxy(function() {
				g.fireSearch({
					selectionSet: C
				})
			}, this))
		}
		var h = [];
		h.push(u);
		var B = v.getTable().getBinding("rows");
		var j = new sap.ui.model.Filter({
			filters: h,
			and: true
		});
		B.filter(j, sap.ui.model.FilterType.Application);
		v.open()
	}
});