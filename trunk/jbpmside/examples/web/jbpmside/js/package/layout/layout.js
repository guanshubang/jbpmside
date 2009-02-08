/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */


Ext.LayoutManager = function(_1, _2) {
    Ext.LayoutManager.superclass.constructor.call(this);
    this.el = Ext.get(_1);
    if (this.el.dom == document.body && Ext.isIE && !_2.allowScroll) {
        document.body.scroll = "no";
    } else {
        if (this.el.dom != document.body && this.el.getStyle("position") == "static") {
            this.el.position("relative");
        }
    }
    this.id = this.el.id;
    this.el.addClass("x-layout-container");
    this.monitorWindowResize = true;
    this.regions = {};
    this.addEvents({"layout":true,"regionresized":true,"regioncollapsed":true,"regionexpanded":true});
    this.updating = false;
    Ext.EventManager.onWindowResize(this.onWindowResize, this, true);
};
Ext.extend(Ext.LayoutManager, Ext.util.Observable, {isUpdating:function() {
    return this.updating;
},beginUpdate:function() {
    this.updating = true;
},endUpdate:function(_3) {
    this.updating = false;
    if (!_3) {
        this.layout();
    }
},layout:function() {
},onRegionResized:function(_4, _5) {
    this.fireEvent("regionresized", _4, _5);
    this.layout();
},onRegionCollapsed:function(_6) {
    this.fireEvent("regioncollapsed", _6);
},onRegionExpanded:function(_7) {
    this.fireEvent("regionexpanded", _7);
},getViewSize:function() {
    var _8;
    if (this.el.dom != document.body) {
        _8 = this.el.getSize();
    } else {
        _8 = {width:Ext.lib.Dom.getViewWidth(),height:Ext.lib.Dom.getViewHeight()};
    }
    _8.width -= this.el.getBorderWidth("lr") - this.el.getPadding("lr");
    _8.height -= this.el.getBorderWidth("tb") - this.el.getPadding("tb");
    return _8;
},getEl:function() {
    return this.el;
},getRegion:function(_9) {
    return this.regions[_9.toLowerCase()];
},onWindowResize:function() {
    if (this.monitorWindowResize) {
        this.layout();
    }
}});

Ext.BorderLayout = function(_1, _2) {
    _2 = _2 || {};
    Ext.BorderLayout.superclass.constructor.call(this, _1, _2);
    this.factory = _2.factory || Ext.BorderLayout.RegionFactory;
    for (var i = 0,_4 = this.factory.validRegions.length; i < _4; i++) {
        var _5 = this.factory.validRegions[i];
        if (_2[_5]) {
            this.addRegion(_5, _2[_5]);
        }
    }
};
Ext.extend(Ext.BorderLayout, Ext.LayoutManager, {addRegion:function(_6, _7) {
    if (!this.regions[_6]) {
        var r = this.factory.create(_6, this, _7);
        this.bindRegion(_6, r);
    }
    return this.regions[_6];
},bindRegion:function(_9, r) {
    this.regions[_9] = r;
    r.on("visibilitychange", this.layout, this);
    r.on("paneladded", this.layout, this);
    r.on("panelremoved", this.layout, this);
    r.on("invalidated", this.layout, this);
    r.on("resized", this.onRegionResized, this);
    r.on("collapsed", this.onRegionCollapsed, this);
    r.on("expanded", this.onRegionExpanded, this);
},layout:function() {
    if (this.updating) {
        return;
    }
    var _b = this.getViewSize();
    var w = _b.width,h = _b.height;
    var _e = w,_f = h,_10 = 0,_11 = 0;
    var rs = this.regions;
    var n = rs["north"],s = rs["south"],_15 = rs["west"],e = rs["east"],c = rs["center"];
    if (n && n.isVisible()) {
        var b = n.getBox();
        var m = n.getMargins();
        b.width = w - (m.left + m.right);
        b.x = m.left;
        b.y = m.top;
        _10 = b.height + b.y + m.bottom;
        _f -= _10;
        n.updateBox(this.safeBox(b));
    }
    if (s && s.isVisible()) {
        var b = s.getBox();
        var m = s.getMargins();
        b.width = w - (m.left + m.right);
        b.x = m.left;
        var _1a = (b.height + m.top + m.bottom);
        b.y = h - _1a + m.top;
        _f -= _1a;
        s.updateBox(this.safeBox(b));
    }
    if (_15 && _15.isVisible()) {
        var b = _15.getBox();
        var m = _15.getMargins();
        b.height = _f - (m.top + m.bottom);
        b.x = m.left;
        b.y = _10 + m.top;
        var _1b = (b.width + m.left + m.right);
        _11 += _1b;
        _e -= _1b;
        _15.updateBox(this.safeBox(b));
    }
    if (e && e.isVisible()) {
        var b = e.getBox();
        var m = e.getMargins();
        b.height = _f - (m.top + m.bottom);
        var _1b = (b.width + m.left + m.right);
        b.x = w - _1b + m.left;
        b.y = _10 + m.top;
        _e -= _1b;
        e.updateBox(this.safeBox(b));
    }
    if (c) {
        var m = c.getMargins();
        var _1c = {x:_11 + m.left,y:_10 + m.top,width:_e - (m.left + m.right),height:_f - (m.top + m.bottom)};
        c.updateBox(this.safeBox(_1c));
    }
    this.el.repaint();
    this.fireEvent("layout", this);
},safeBox:function(box) {
    box.width = Math.max(0, box.width);
    box.height = Math.max(0, box.height);
    return box;
},add:function(_1e, _1f) {
    _1e = _1e.toLowerCase();
    return this.regions[_1e].add(_1f);
},remove:function(_20, _21) {
    _20 = _20.toLowerCase();
    return this.regions[_20].remove(_21);
},findPanel:function(_22) {
    var rs = this.regions;
    for (var _24 in rs) {
        if (typeof rs[_24] != "function") {
            var p = rs[_24].getPanel(_22);
            if (p) {
                return p;
            }
        }
    }
    return null;
},showPanel:function(_26) {
    var rs = this.regions;
    for (var _28 in rs) {
        var r = rs[_28];
        if (typeof r != "function") {
            if (r.hasPanel(_26)) {
                return r.showPanel(_26);
            }
        }
    }
    return null;
},restoreState:function(_2a) {
    if (!_2a) {
        _2a = Ext.state.Manager;
    }
    var sm = new Ext.LayoutStateManager();
    sm.init(this, _2a);
},batchAdd:function(_2c) {
    this.beginUpdate();
    for (var _2d in _2c) {
        var lr = this.regions[_2d];
        if (lr) {
            this.addTypedPanels(lr, _2c[_2d]);
        }
    }
    this.endUpdate();
},addTypedPanels:function(lr, ps) {
    if (typeof ps == "string") {
        lr.add(new Ext.ContentPanel(ps));
    } else {
        if (ps instanceof Array) {
            for (var i = 0,len = ps.length; i < len; i++) {
                this.addTypedPanels(lr, ps[i]);
            }
        } else {
            if (!ps.events) {
                var el = ps.el;
                delete ps.el;
                lr.add(new Ext.ContentPanel(el || Ext.id(), ps));
            } else {
                lr.add(ps);
            }
        }
    }
}});
Ext.BorderLayout.create = function(_34, _35) {
    var _36 = new Ext.BorderLayout(_35 || document.body, _34);
    _36.beginUpdate();
    var _37 = Ext.BorderLayout.RegionFactory.validRegions;
    for (var j = 0,_39 = _37.length; j < _39; j++) {
        var lr = _37[j];
        if (_36.regions[lr] && _34[lr].panels) {
            var r = _36.regions[lr];
            var ps = _34[lr].panels;
            _36.addTypedPanels(r, ps);
        }
    }
    _36.endUpdate();
    return _36;
};
Ext.BorderLayout.RegionFactory = {validRegions:["north","south","east","west","center"],create:function(_3d, mgr, _3f) {
    _3d = _3d.toLowerCase();
    if (_3f.lightweight || _3f.basic) {
        return new Ext.BasicLayoutRegion(mgr, _3f, _3d);
    }
    switch (_3d) {case"north":return new Ext.NorthLayoutRegion(mgr, _3f);case"south":return new Ext.SouthLayoutRegion(mgr, _3f);case"east":return new Ext.EastLayoutRegion(mgr, _3f);case"west":return new Ext.WestLayoutRegion(mgr, _3f);case"center":return new Ext.CenterLayoutRegion(mgr, _3f);}
    throw"Layout region \"" + _3d + "\" not supported.";
}};

Ext.BasicLayoutRegion = function(_1, _2, _3, _4) {
    this.mgr = _1;
    this.position = _3;
    this.events = {"beforeremove":true,"invalidated":true,"visibilitychange":true,"paneladded":true,"panelremoved":true,"collapsed":true,"expanded":true,"slideshow":true,"slidehide":true,"panelactivated":true,"resized":true};
    this.panels = new Ext.util.MixedCollection();
    this.panels.getKey = this.getPanelId.createDelegate(this);
    this.box = null;
    this.activePanel = null;
    if (_4 !== true) {
        this.applyConfig(_2);
    }
};
Ext.extend(Ext.BasicLayoutRegion, Ext.util.Observable, {getPanelId:function(p) {
    return p.getId();
},applyConfig:function(_6) {
    this.margins = _6.margins || this.margins || {top:0,left:0,right:0,bottom:0};
    this.config = _6;
},resizeTo:function(_7) {
    var el = this.el ? this.el : (this.activePanel ? this.activePanel.getEl() : null);
    if (el) {
        switch (this.position) {case"east":case"west":el.setWidth(_7);this.fireEvent("resized", this, _7);break;case"north":case"south":el.setHeight(_7);this.fireEvent("resized", this, _7);break;}
    }
},getBox:function() {
    return this.activePanel ? this.activePanel.getEl().getBox(false, true) : null;
},getMargins:function() {
    return this.margins;
},updateBox:function(_9) {
    this.box = _9;
    var el = this.activePanel.getEl();
    el.dom.style.left = _9.x + "px";
    el.dom.style.top = _9.y + "px";
    this.activePanel.setSize(_9.width, _9.height);
},getEl:function() {
    return this.activePanel;
},isVisible:function() {
    return this.activePanel ? true : false;
},setActivePanel:function(_b) {
    _b = this.getPanel(_b);
    if (this.activePanel && this.activePanel != _b) {
        this.activePanel.setActiveState(false);
        this.activePanel.getEl().setLeftTop(-10000, -10000);
    }
    this.activePanel = _b;
    _b.setActiveState(true);
    if (this.box) {
        _b.setSize(this.box.width, this.box.height);
    }
    this.fireEvent("panelactivated", this, _b);
    this.fireEvent("invalidated");
},showPanel:function(_c) {
    if (_c = this.getPanel(_c)) {
        this.setActivePanel(_c);
    }
    return _c;
},getActivePanel:function() {
    return this.activePanel;
},add:function(_d) {
    if (arguments.length > 1) {
        for (var i = 0,_f = arguments.length; i < _f; i++) {
            this.add(arguments[i]);
        }
        return null;
    }
    if (this.hasPanel(_d)) {
        this.showPanel(_d);
        return _d;
    }
    var el = _d.getEl();
    if (el.dom.parentNode != this.mgr.el.dom) {
        this.mgr.el.dom.appendChild(el.dom);
    }
    if (_d.setRegion) {
        _d.setRegion(this);
    }
    this.panels.add(_d);
    el.setStyle("position", "absolute");
    if (!_d.background) {
        this.setActivePanel(_d);
        if (this.config.initialSize && this.panels.getCount() == 1) {
            this.resizeTo(this.config.initialSize);
        }
    }
    this.fireEvent("paneladded", this, _d);
    return _d;
},hasPanel:function(_11) {
    if (typeof _11 == "object") {
        _11 = _11.getId();
    }
    return this.getPanel(_11) ? true : false;
},remove:function(_12, _13) {
    _12 = this.getPanel(_12);
    if (!_12) {
        return null;
    }
    var e = {};
    this.fireEvent("beforeremove", this, _12, e);
    if (e.cancel === true) {
        return null;
    }
    var _15 = _12.getId();
    this.panels.removeKey(_15);
    return _12;
},getPanel:function(id) {
    if (typeof id == "object") {
        return id;
    }
    return this.panels.get(id);
},getPosition:function() {
    return this.position;
}});

Ext.LayoutRegion = function(_1, _2, _3) {
    Ext.LayoutRegion.superclass.constructor.call(this, _1, _2, _3, true);
    var dh = Ext.DomHelper;
    this.el = dh.append(_1.el.dom, {tag:"div",cls:"x-layout-panel x-layout-panel-" + this.position}, true);
    this.titleEl = dh.append(this.el.dom, {tag:"div",unselectable:"on",cls:"x-unselectable x-layout-panel-hd x-layout-title-" + this.position,children:[{tag:"span",cls:"x-unselectable x-layout-panel-hd-text",unselectable:"on",html:"&#160;"},{tag:"div",cls:"x-unselectable x-layout-panel-hd-tools",unselectable:"on"}]}, true);
    this.titleEl.enableDisplayMode();
    this.titleTextEl = this.titleEl.dom.firstChild;
    this.tools = Ext.get(this.titleEl.dom.childNodes[1], true);
    this.closeBtn = this.createTool(this.tools.dom, "x-layout-close");
    this.closeBtn.enableDisplayMode();
    this.closeBtn.on("click", this.closeClicked, this);
    this.closeBtn.hide();
    this.createBody(_2);
    this.visible = true;
    this.collapsed = false;
    if (_2.hideWhenEmpty) {
        this.hide();
        this.on("paneladded", this.validateVisibility, this);
        this.on("panelremoved", this.validateVisibility, this);
    }
    this.applyConfig(_2);
};
Ext.extend(Ext.LayoutRegion, Ext.BasicLayoutRegion, {createBody:function() {
    this.bodyEl = this.el.createChild({tag:"div",cls:"x-layout-panel-body"});
},applyConfig:function(c) {
    if (c.collapsible && this.position != "center" && !this.collapsedEl) {
        var dh = Ext.DomHelper;
        if (c.titlebar !== false) {
            this.collapseBtn = this.createTool(this.tools.dom, "x-layout-collapse-" + this.position);
            this.collapseBtn.on("click", this.collapse, this);
            this.collapseBtn.enableDisplayMode();
            if (c.showPin === true || this.showPin) {
                this.stickBtn = this.createTool(this.tools.dom, "x-layout-stick");
                this.stickBtn.enableDisplayMode();
                this.stickBtn.on("click", this.expand, this);
                this.stickBtn.hide();
            }
        }
        this.collapsedEl = dh.append(this.mgr.el.dom, {cls:"x-layout-collapsed x-layout-collapsed-" + this.position,children:[{cls:"x-layout-collapsed-tools",children:[{cls:"x-layout-ctools-inner"}]}]}, true);
        if (c.floatable !== false) {
            this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
            this.collapsedEl.on("click", this.collapseClick, this);
        }
        if (c.collapsedTitle && (this.position == "north" || this.position == "south")) {
            this.collapsedTitleTextEl = dh.append(this.collapsedEl.dom, {tag:"div",cls:"x-unselectable x-layout-panel-hd-text",id:"message",unselectable:"on",style:{"float":"left"}});
            this.collapsedTitleTextEl.innerHTML = c.collapsedTitle;
        }
        this.expandBtn = this.createTool(this.collapsedEl.dom.firstChild.firstChild, "x-layout-expand-" + this.position);
        this.expandBtn.on("click", this.expand, this);
    }
    if (this.collapseBtn) {
        this.collapseBtn.setVisible(c.collapsible == true);
    }
    this.cmargins = c.cmargins || this.cmargins || (this.position == "west" || this.position == "east" ? {top:0,left:2,right:2,bottom:0} : {top:2,left:0,right:0,bottom:2});
    this.margins = c.margins || this.margins || {top:0,left:0,right:0,bottom:0};
    this.bottomTabs = c.tabPosition != "top";
    this.autoScroll = c.autoScroll || false;
    if (this.autoScroll) {
        this.bodyEl.setStyle("overflow", "auto");
    } else {
        this.bodyEl.setStyle("overflow", "hidden");
    }
    if ((!c.titlebar && !c.title) || c.titlebar === false) {
        this.titleEl.hide();
    } else {
        this.titleEl.show();
        if (c.title) {
            this.titleTextEl.innerHTML = c.title;
        }
    }
    this.duration = c.duration || 0.3;
    this.slideDuration = c.slideDuration || 0.45;
    this.config = c;
    if (c.collapsed) {
        this.collapse(true);
    }
    if (c.hidden) {
        this.hide();
    }
},isVisible:function() {
    return this.visible;
},setCollapsedTitle:function(_7) {
    _7 = _7 || "&#160;";
    if (this.collapsedTitleTextEl) {
        this.collapsedTitleTextEl.innerHTML = _7;
    }
},getBox:function() {
    var b;
    if (!this.collapsed) {
        b = this.el.getBox(false, true);
    } else {
        b = this.collapsedEl.getBox(false, true);
    }
    return b;
},getMargins:function() {
    return this.collapsed ? this.cmargins : this.margins;
},highlight:function() {
    this.el.addClass("x-layout-panel-dragover");
},unhighlight:function() {
    this.el.removeClass("x-layout-panel-dragover");
},updateBox:function(_9) {
    this.box = _9;
    if (!this.collapsed) {
        this.el.dom.style.left = _9.x + "px";
        this.el.dom.style.top = _9.y + "px";
        this.updateBody(_9.width, _9.height);
    } else {
        this.collapsedEl.dom.style.left = _9.x + "px";
        this.collapsedEl.dom.style.top = _9.y + "px";
        this.collapsedEl.setSize(_9.width, _9.height);
    }
    if (this.tabs) {
        this.tabs.autoSizeTabs();
    }
},updateBody:function(w, h) {
    if (w !== null) {
        this.el.setWidth(w);
        w -= this.el.getBorderWidth("rl");
        if (this.config.adjustments) {
            w += this.config.adjustments[0];
        }
    }
    if (h !== null) {
        this.el.setHeight(h);
        h = this.titleEl && this.titleEl.isDisplayed() ? h - (this.titleEl.getHeight() || 0) : h;
        h -= this.el.getBorderWidth("tb");
        if (this.config.adjustments) {
            h += this.config.adjustments[1];
        }
        this.bodyEl.setHeight(h);
        if (this.tabs) {
            h = this.tabs.syncHeight(h);
        }
    }
    if (this.panelSize) {
        w = w !== null ? w : this.panelSize.width;
        h = h !== null ? h : this.panelSize.height;
    }
    if (this.activePanel) {
        var el = this.activePanel.getEl();
        w = w !== null ? w : el.getWidth();
        h = h !== null ? h : el.getHeight();
        this.panelSize = {width:w,height:h};
        this.activePanel.setSize(w, h);
    }
    if (Ext.isIE && this.tabs) {
        this.tabs.el.repaint();
    }
},getEl:function() {
    return this.el;
},hide:function() {
    if (!this.collapsed) {
        this.el.dom.style.left = "-2000px";
        this.el.hide();
    } else {
        this.collapsedEl.dom.style.left = "-2000px";
        this.collapsedEl.hide();
    }
    this.visible = false;
    this.fireEvent("visibilitychange", this, false);
},show:function() {
    if (!this.collapsed) {
        this.el.show();
    } else {
        this.collapsedEl.show();
    }
    this.visible = true;
    this.fireEvent("visibilitychange", this, true);
},closeClicked:function() {
    if (this.activePanel) {
        this.remove(this.activePanel);
    }
},collapseClick:function(e) {
    if (this.isSlid) {
        e.stopPropagation();
        this.slideIn();
    } else {
        e.stopPropagation();
        this.slideOut();
    }
},collapse:function(_e) {
    if (this.collapsed) {
        return;
    }
    this.collapsed = true;
    if (this.split) {
        this.split.el.hide();
    }
    if (this.config.animate && _e !== true) {
        this.fireEvent("invalidated", this);
        this.animateCollapse();
    } else {
        this.el.setLocation(-20000, -20000);
        this.el.hide();
        this.collapsedEl.show();
        this.fireEvent("collapsed", this);
        this.fireEvent("invalidated", this);
    }
},animateCollapse:function() {
},expand:function(e, _10) {
    if (e) {
        e.stopPropagation();
    }
    if (!this.collapsed || this.el.hasActiveFx()) {
        return;
    }
    if (this.isSlid) {
        this.afterSlideIn();
        _10 = true;
    }
    this.collapsed = false;
    if (this.config.animate && _10 !== true) {
        this.animateExpand();
    } else {
        this.el.show();
        if (this.split) {
            this.split.el.show();
        }
        this.collapsedEl.setLocation(-2000, -2000);
        this.collapsedEl.hide();
        this.fireEvent("invalidated", this);
        this.fireEvent("expanded", this);
    }
},animateExpand:function() {
},initTabs:function() {
    this.bodyEl.setStyle("overflow", "hidden");
    var ts = new Ext.TabPanel(this.bodyEl.dom, {tabPosition:this.bottomTabs ? "bottom" : "top",disableTooltips:this.config.disableTabTips});
    if (this.config.hideTabs) {
        ts.stripWrap.setDisplayed(false);
    }
    this.tabs = ts;
    ts.resizeTabs = this.config.resizeTabs === true;
    ts.minTabWidth = this.config.minTabWidth || 40;
    ts.maxTabWidth = this.config.maxTabWidth || 250;
    ts.preferredTabWidth = this.config.preferredTabWidth || 150;
    ts.monitorResize = false;
    ts.bodyEl.setStyle("overflow", this.config.autoScroll ? "auto" : "hidden");
    ts.bodyEl.addClass("x-layout-tabs-body");
    this.panels.each(this.initPanelAsTab, this);
},initPanelAsTab:function(_12) {
    var ti = this.tabs.addTab(_12.getEl().id, _12.getTitle(), null, this.config.closeOnTab && _12.isClosable());
    if (_12.tabTip !== undefined) {
        ti.setTooltip(_12.tabTip);
    }
    ti.on("activate", function() {
        this.setActivePanel(_12);
    }, this);
    if (this.config.closeOnTab) {
        ti.on("beforeclose", function(t, e) {
            e.cancel = true;
            this.remove(_12);
        }, this);
    }
    return ti;
},updatePanelTitle:function(_16, _17) {
    if (this.activePanel == _16) {
        this.updateTitle(_17);
    }
    if (this.tabs) {
        var ti = this.tabs.getTab(_16.getEl().id);
        ti.setText(_17);
        if (_16.tabTip !== undefined) {
            ti.setTooltip(_16.tabTip);
        }
    }
},updateTitle:function(_19) {
    if (this.titleTextEl && !this.config.title) {
        this.titleTextEl.innerHTML = (typeof _19 != "undefined" && _19.length > 0 ? _19 : "&#160;");
    }
},setActivePanel:function(_1a) {
    _1a = this.getPanel(_1a);
    if (this.activePanel && this.activePanel != _1a) {
        this.activePanel.setActiveState(false);
    }
    this.activePanel = _1a;
    _1a.setActiveState(true);
    if (this.panelSize) {
        _1a.setSize(this.panelSize.width, this.panelSize.height);
    }
    if (this.closeBtn) {
        this.closeBtn.setVisible(!this.config.closeOnTab && !this.isSlid && _1a.isClosable());
    }
    this.updateTitle(_1a.getTitle());
    if (this.tabs) {
        this.fireEvent("invalidated", this);
    }
    this.fireEvent("panelactivated", this, _1a);
},showPanel:function(_1b) {
    if (_1b = this.getPanel(_1b)) {
        if (this.tabs) {
            var tab = this.tabs.getTab(_1b.getEl().id);
            if (tab.isHidden()) {
                this.tabs.unhideTab(tab.id);
            }
            tab.activate();
        } else {
            this.setActivePanel(_1b);
        }
    }
    return _1b;
},getActivePanel:function() {
    return this.activePanel;
},validateVisibility:function() {
    if (this.panels.getCount() < 1) {
        this.updateTitle("&#160;");
        this.closeBtn.hide();
        this.hide();
    } else {
        if (!this.isVisible()) {
            this.show();
        }
    }
},add:function(_1d) {
    if (arguments.length > 1) {
        for (var i = 0,len = arguments.length; i < len; i++) {
            this.add(arguments[i]);
        }
        return null;
    }
    if (this.hasPanel(_1d)) {
        this.showPanel(_1d);
        return _1d;
    }
    _1d.setRegion(this);
    this.panels.add(_1d);
    if (this.panels.getCount() == 1 && !this.config.alwaysShowTabs) {
        this.bodyEl.dom.appendChild(_1d.getEl().dom);
        if (_1d.background !== true) {
            this.setActivePanel(_1d);
        }
        this.fireEvent("paneladded", this, _1d);
        return _1d;
    }
    if (!this.tabs) {
        this.initTabs();
    } else {
        this.initPanelAsTab(_1d);
    }
    if (_1d.background !== true) {
        this.tabs.activate(_1d.getEl().id);
    }
    this.fireEvent("paneladded", this, _1d);
    return _1d;
},hidePanel:function(_20) {
    if (this.tabs && (_20 = this.getPanel(_20))) {
        this.tabs.hideTab(_20.getEl().id);
    }
},unhidePanel:function(_21) {
    if (this.tabs && (_21 = this.getPanel(_21))) {
        this.tabs.unhideTab(_21.getEl().id);
    }
},clearPanels:function() {
    while (this.panels.getCount() > 0) {
        this.remove(this.panels.first());
    }
},remove:function(_22, _23) {
    _22 = this.getPanel(_22);
    if (!_22) {
        return null;
    }
    var e = {};
    this.fireEvent("beforeremove", this, _22, e);
    if (e.cancel === true) {
        return null;
    }
    _23 = (typeof _23 != "undefined" ? _23 : (this.config.preservePanels === true || _22.preserve === true));
    var _25 = _22.getId();
    this.panels.removeKey(_25);
    if (_23) {
        document.body.appendChild(_22.getEl().dom);
    }
    if (this.tabs) {
        this.tabs.removeTab(_22.getEl().id);
    } else {
        if (!_23) {
            this.bodyEl.dom.removeChild(_22.getEl().dom);
        }
    }
    if (this.panels.getCount() == 1 && this.tabs && !this.config.alwaysShowTabs) {
        var p = this.panels.first();
        var _27 = document.createElement("div");
        _27.appendChild(p.getEl().dom);
        this.bodyEl.update("");
        this.bodyEl.dom.appendChild(p.getEl().dom);
        _27 = null;
        this.updateTitle(p.getTitle());
        this.tabs = null;
        this.bodyEl.setStyle("overflow", this.config.autoScroll ? "auto" : "hidden");
        this.setActivePanel(p);
    }
    _22.setRegion(null);
    if (this.activePanel == _22) {
        this.activePanel = null;
    }
    if (this.config.autoDestroy !== false && _23 !== true) {
        try {
            _22.destroy();
        } catch(e) {
        }
    }
    this.fireEvent("panelremoved", this, _22);
    return _22;
},getTabs:function() {
    return this.tabs;
},createTool:function(_28, _29) {
    var btn = Ext.DomHelper.append(_28, {tag:"div",cls:"x-layout-tools-button",children:[{tag:"div",cls:"x-layout-tools-button-inner " + _29,html:"&#160;"}]}, true);
    btn.addClassOnOver("x-layout-tools-button-over");
    return btn;
}});

Ext.SplitLayoutRegion = function(_1, _2, _3, _4) {
    this.cursor = _4;
    Ext.SplitLayoutRegion.superclass.constructor.call(this, _1, _2, _3);
};
Ext.extend(Ext.SplitLayoutRegion, Ext.LayoutRegion, {splitTip:"Drag to resize.",collapsibleSplitTip:"Drag to resize. Double click to hide.",useSplitTips:false,applyConfig:function(_5) {
    Ext.SplitLayoutRegion.superclass.applyConfig.call(this, _5);
    if (_5.split) {
        if (!this.split) {
            var _6 = Ext.DomHelper.append(this.mgr.el.dom, {tag:"div",id:this.el.id + "-split",cls:"x-layout-split x-layout-split-" + this.position,html:"&#160;"});
            this.split = new Ext.SplitBar(_6, this.el, this.orientation);
            this.split.on("moved", this.onSplitMove, this);
            this.split.useShim = _5.useShim === true;
            this.split.getMaximumSize = this[this.position == "north" || this.position == "south" ? "getVMaxSize" : "getHMaxSize"].createDelegate(this);
            if (this.useSplitTips) {
                this.split.el.dom.title = _5.collapsible ? this.collapsibleSplitTip : this.splitTip;
            }
            if (_5.collapsible) {
                this.split.el.on("dblclick", this.collapse, this);
            }
        }
        if (typeof _5.minSize != "undefined") {
            this.split.minSize = _5.minSize;
        }
        if (typeof _5.maxSize != "undefined") {
            this.split.maxSize = _5.maxSize;
        }
        if (_5.hideWhenEmpty || _5.hidden) {
            this.hideSplitter();
        }
    }
},getHMaxSize:function() {
    var _7 = this.config.maxSize || 10000;
    var _8 = this.mgr.getRegion("center");
    return Math.min(_7, (this.el.getWidth() + _8.getEl().getWidth()) - _8.getMinWidth());
},getVMaxSize:function() {
    var _9 = this.config.maxSize || 10000;
    var _a = this.mgr.getRegion("center");
    return Math.min(_9, (this.el.getHeight() + _a.getEl().getHeight()) - _a.getMinHeight());
},onSplitMove:function(_b, _c) {
    this.fireEvent("resized", this, _c);
},getSplitBar:function() {
    return this.split;
},hide:function() {
    this.hideSplitter();
    Ext.SplitLayoutRegion.superclass.hide.call(this);
},hideSplitter:function() {
    if (this.split) {
        this.split.el.setLocation(-2000, -2000);
        this.split.el.hide();
    }
},show:function() {
    if (this.split) {
        this.split.el.show();
    }
    Ext.SplitLayoutRegion.superclass.show.call(this);
},beforeSlide:function() {
    if (Ext.isGecko) {
        this.bodyEl.clip();
        if (this.tabs) {
            this.tabs.bodyEl.clip();
        }
        if (this.activePanel) {
            this.activePanel.getEl().clip();
            if (this.activePanel.beforeSlide) {
                this.activePanel.beforeSlide();
            }
        }
    }
},afterSlide:function() {
    if (Ext.isGecko) {
        this.bodyEl.unclip();
        if (this.tabs) {
            this.tabs.bodyEl.unclip();
        }
        if (this.activePanel) {
            this.activePanel.getEl().unclip();
            if (this.activePanel.afterSlide) {
                this.activePanel.afterSlide();
            }
        }
    }
},initAutoHide:function() {
    if (this.autoHide !== false) {
        if (!this.autoHideHd) {
            var st = new Ext.util.DelayedTask(this.slideIn, this);
            this.autoHideHd = {"mouseout":function(e) {
                if (!e.within(this.el, true)) {
                    st.delay(500);
                }
            },"mouseover":function(e) {
                st.cancel();
            },scope:this};
        }
        this.el.on(this.autoHideHd);
    }
},clearAutoHide:function() {
    if (this.autoHide !== false) {
        this.el.un("mouseout", this.autoHideHd.mouseout);
        this.el.un("mouseover", this.autoHideHd.mouseover);
    }
},clearMonitor:function() {
    Ext.get(document).un("click", this.slideInIf, this);
},slideOut:function() {
    if (this.isSlid || this.el.hasActiveFx()) {
        return;
    }
    this.isSlid = true;
    if (this.collapseBtn) {
        this.collapseBtn.hide();
    }
    this.closeBtnState = this.closeBtn.getStyle("display");
    this.closeBtn.hide();
    if (this.stickBtn) {
        this.stickBtn.show();
    }
    this.el.show();
    this.el.alignTo(this.collapsedEl, this.getCollapseAnchor());
    this.beforeSlide();
    this.el.setStyle("z-index", 10001);
    this.el.slideIn(this.getSlideAnchor(), {callback:function() {
        this.afterSlide();
        this.initAutoHide();
        Ext.get(document).on("click", this.slideInIf, this);
        this.fireEvent("slideshow", this);
    },scope:this,block:true});
},afterSlideIn:function() {
    this.clearAutoHide();
    this.isSlid = false;
    this.clearMonitor();
    this.el.setStyle("z-index", "");
    if (this.collapseBtn) {
        this.collapseBtn.show();
    }
    this.closeBtn.setStyle("display", this.closeBtnState);
    if (this.stickBtn) {
        this.stickBtn.hide();
    }
    this.fireEvent("slidehide", this);
},slideIn:function(cb) {
    if (!this.isSlid || this.el.hasActiveFx()) {
        Ext.callback(cb);
        return;
    }
    this.isSlid = false;
    this.beforeSlide();
    this.el.slideOut(this.getSlideAnchor(), {callback:function() {
        this.el.setLeftTop(-10000, -10000);
        this.afterSlide();
        this.afterSlideIn();
        Ext.callback(cb);
    },scope:this,block:true});
},slideInIf:function(e) {
    if (!e.within(this.el)) {
        this.slideIn();
    }
},animateCollapse:function() {
    this.beforeSlide();
    this.el.setStyle("z-index", 20000);
    var _12 = this.getSlideAnchor();
    this.el.slideOut(_12, {callback:function() {
        this.el.setStyle("z-index", "");
        this.collapsedEl.slideIn(_12, {duration:0.3});
        this.afterSlide();
        this.el.setLocation(-10000, -10000);
        this.el.hide();
        this.fireEvent("collapsed", this);
    },scope:this,block:true});
},animateExpand:function() {
    this.beforeSlide();
    this.el.alignTo(this.collapsedEl, this.getCollapseAnchor(), this.getExpandAdj());
    this.el.setStyle("z-index", 20000);
    this.collapsedEl.hide({duration:0.1});
    this.el.slideIn(this.getSlideAnchor(), {callback:function() {
        this.el.setStyle("z-index", "");
        this.afterSlide();
        if (this.split) {
            this.split.el.show();
        }
        this.fireEvent("invalidated", this);
        this.fireEvent("expanded", this);
    },scope:this,block:true});
},anchors:{"west":"left","east":"right","north":"top","south":"bottom"},sanchors:{"west":"l","east":"r","north":"t","south":"b"},canchors:{"west":"tl-tr","east":"tr-tl","north":"tl-bl","south":"bl-tl"},getAnchor:function() {
    return this.anchors[this.position];
},getCollapseAnchor:function() {
    return this.canchors[this.position];
},getSlideAnchor:function() {
    return this.sanchors[this.position];
},getAlignAdj:function() {
    var cm = this.cmargins;
    switch (this.position) {case"west":return[0,0];break;case"east":return[0,0];break;case"north":return[0,0];break;case"south":return[0,0];break;}
},getExpandAdj:function() {
    var c = this.collapsedEl,cm = this.cmargins;
    switch (this.position) {case"west":return[-(cm.right + c.getWidth() + cm.left),0];break;case"east":return[cm.right + c.getWidth() + cm.left,0];break;case"north":return[0,-(cm.top + cm.bottom + c.getHeight())];break;case"south":return[0,cm.top + cm.bottom + c.getHeight()];break;}
}});

Ext.CenterLayoutRegion = function(_1, _2) {
    Ext.CenterLayoutRegion.superclass.constructor.call(this, _1, _2, "center");
    this.visible = true;
    this.minWidth = _2.minWidth || 20;
    this.minHeight = _2.minHeight || 20;
};
Ext.extend(Ext.CenterLayoutRegion, Ext.LayoutRegion, {hide:function() {
},show:function() {
},getMinWidth:function() {
    return this.minWidth;
},getMinHeight:function() {
    return this.minHeight;
}});
Ext.NorthLayoutRegion = function(_3, _4) {
    Ext.NorthLayoutRegion.superclass.constructor.call(this, _3, _4, "north", "n-resize");
    if (this.split) {
        this.split.placement = Ext.SplitBar.TOP;
        this.split.orientation = Ext.SplitBar.VERTICAL;
        this.split.el.addClass("x-layout-split-v");
    }
    var _5 = _4.initialSize || _4.height;
    if (typeof _5 != "undefined") {
        this.el.setHeight(_5);
    }
};
Ext.extend(Ext.NorthLayoutRegion, Ext.SplitLayoutRegion, {orientation:Ext.SplitBar.VERTICAL,getBox:function() {
    if (this.collapsed) {
        return this.collapsedEl.getBox();
    }
    var _6 = this.el.getBox();
    if (this.split) {
        _6.height += this.split.el.getHeight();
    }
    return _6;
},updateBox:function(_7) {
    if (this.split && !this.collapsed) {
        _7.height -= this.split.el.getHeight();
        this.split.el.setLeft(_7.x);
        this.split.el.setTop(_7.y + _7.height);
        this.split.el.setWidth(_7.width);
    }
    if (this.collapsed) {
        this.updateBody(_7.width, null);
    }
    Ext.NorthLayoutRegion.superclass.updateBox.call(this, _7);
}});
Ext.SouthLayoutRegion = function(_8, _9) {
    Ext.SouthLayoutRegion.superclass.constructor.call(this, _8, _9, "south", "s-resize");
    if (this.split) {
        this.split.placement = Ext.SplitBar.BOTTOM;
        this.split.orientation = Ext.SplitBar.VERTICAL;
        this.split.el.addClass("x-layout-split-v");
    }
    var _a = _9.initialSize || _9.height;
    if (typeof _a != "undefined") {
        this.el.setHeight(_a);
    }
};
Ext.extend(Ext.SouthLayoutRegion, Ext.SplitLayoutRegion, {orientation:Ext.SplitBar.VERTICAL,getBox:function() {
    if (this.collapsed) {
        return this.collapsedEl.getBox();
    }
    var _b = this.el.getBox();
    if (this.split) {
        var sh = this.split.el.getHeight();
        _b.height += sh;
        _b.y -= sh;
    }
    return _b;
},updateBox:function(_d) {
    if (this.split && !this.collapsed) {
        var sh = this.split.el.getHeight();
        _d.height -= sh;
        _d.y += sh;
        this.split.el.setLeft(_d.x);
        this.split.el.setTop(_d.y - sh);
        this.split.el.setWidth(_d.width);
    }
    if (this.collapsed) {
        this.updateBody(_d.width, null);
    }
    Ext.SouthLayoutRegion.superclass.updateBox.call(this, _d);
}});
Ext.EastLayoutRegion = function(_f, _10) {
    Ext.EastLayoutRegion.superclass.constructor.call(this, _f, _10, "east", "e-resize");
    if (this.split) {
        this.split.placement = Ext.SplitBar.RIGHT;
        this.split.orientation = Ext.SplitBar.HORIZONTAL;
        this.split.el.addClass("x-layout-split-h");
    }
    var _11 = _10.initialSize || _10.width;
    if (typeof _11 != "undefined") {
        this.el.setWidth(_11);
    }
};
Ext.extend(Ext.EastLayoutRegion, Ext.SplitLayoutRegion, {orientation:Ext.SplitBar.HORIZONTAL,getBox:function() {
    if (this.collapsed) {
        return this.collapsedEl.getBox();
    }
    var box = this.el.getBox();
    if (this.split) {
        var sw = this.split.el.getWidth();
        box.width += sw;
        box.x -= sw;
    }
    return box;
},updateBox:function(box) {
    if (this.split && !this.collapsed) {
        var sw = this.split.el.getWidth();
        box.width -= sw;
        this.split.el.setLeft(box.x);
        this.split.el.setTop(box.y);
        this.split.el.setHeight(box.height);
        box.x += sw;
    }
    if (this.collapsed) {
        this.updateBody(null, box.height);
    }
    Ext.EastLayoutRegion.superclass.updateBox.call(this, box);
}});
Ext.WestLayoutRegion = function(mgr, _17) {
    Ext.WestLayoutRegion.superclass.constructor.call(this, mgr, _17, "west", "w-resize");
    if (this.split) {
        this.split.placement = Ext.SplitBar.LEFT;
        this.split.orientation = Ext.SplitBar.HORIZONTAL;
        this.split.el.addClass("x-layout-split-h");
    }
    var _18 = _17.initialSize || _17.width;
    if (typeof _18 != "undefined") {
        this.el.setWidth(_18);
    }
};
Ext.extend(Ext.WestLayoutRegion, Ext.SplitLayoutRegion, {orientation:Ext.SplitBar.HORIZONTAL,getBox:function() {
    if (this.collapsed) {
        return this.collapsedEl.getBox();
    }
    var box = this.el.getBox();
    if (this.split) {
        box.width += this.split.el.getWidth();
    }
    return box;
},updateBox:function(box) {
    if (this.split && !this.collapsed) {
        var sw = this.split.el.getWidth();
        box.width -= sw;
        this.split.el.setLeft(box.x + box.width);
        this.split.el.setTop(box.y);
        this.split.el.setHeight(box.height);
    }
    if (this.collapsed) {
        this.updateBody(null, box.height);
    }
    Ext.WestLayoutRegion.superclass.updateBox.call(this, box);
}});

Ext.LayoutStateManager = function(_1) {
    this.state = {north:{},south:{},east:{},west:{}};
};
Ext.LayoutStateManager.prototype = {init:function(_2, _3) {
    this.provider = _3;
    var _4 = _3.get(_2.id + "-layout-state");
    if (_4) {
        var _5 = _2.isUpdating();
        if (!_5) {
            _2.beginUpdate();
        }
        for (var _6 in _4) {
            if (typeof _4[_6] != "function") {
                var _7 = _4[_6];
                var r = _2.getRegion(_6);
                if (r && _7) {
                    if (_7.size) {
                        r.resizeTo(_7.size);
                    }
                    if (_7.collapsed == true) {
                        r.collapse(true);
                    } else {
                        r.expand(null, true);
                    }
                }
            }
        }
        if (!_5) {
            _2.endUpdate();
        }
        this.state = _4;
    }
    this.layout = _2;
    _2.on("regionresized", this.onRegionResized, this);
    _2.on("regioncollapsed", this.onRegionCollapsed, this);
    _2.on("regionexpanded", this.onRegionExpanded, this);
},storeState:function() {
    this.provider.set(this.layout.id + "-layout-state", this.state);
},onRegionResized:function(_9, _a) {
    this.state[_9.getPosition()].size = _a;
    this.storeState();
},onRegionCollapsed:function(_b) {
    this.state[_b.getPosition()].collapsed = true;
    this.storeState();
},onRegionExpanded:function(_c) {
    this.state[_c.getPosition()].collapsed = false;
    this.storeState();
}};

Ext.ContentPanel = function(el, _2, _3) {
    if (el.autoCreate) {
        _2 = el;
        el = Ext.id();
    }
    this.el = Ext.get(el);
    if (!this.el && _2 && _2.autoCreate) {
        if (typeof _2.autoCreate == "object") {
            if (!_2.autoCreate.id) {
                _2.autoCreate.id = _2.id || el;
            }
            this.el = Ext.DomHelper.append(document.body, _2.autoCreate, true);
        } else {
            this.el = Ext.DomHelper.append(document.body, {tag:"div",cls:"x-layout-inactive-content",id:_2.id || el}, true);
        }
    }
    this.closable = false;
    this.loaded = false;
    this.active = false;
    if (typeof _2 == "string") {
        this.title = _2;
    } else {
        Ext.apply(this, _2);
    }
    if (this.resizeEl) {
        this.resizeEl = Ext.get(this.resizeEl, true);
    } else {
        this.resizeEl = this.el;
    }
    this.addEvents({"activate":true,"deactivate":true,"resize":true});
    if (this.autoScroll) {
        this.resizeEl.setStyle("overflow", "auto");
    }
    _3 = _3 || this.content;
    if (_3) {
        this.setContent(_3);
    }
    if (_2 && _2.url) {
        this.setUrl(this.url, this.params, this.loadOnce);
    }
    Ext.ContentPanel.superclass.constructor.call(this);
};
Ext.extend(Ext.ContentPanel, Ext.util.Observable, {tabTip:"",setRegion:function(_4) {
    this.region = _4;
    if (_4) {
        this.el.replaceClass("x-layout-inactive-content", "x-layout-active-content");
    } else {
        this.el.replaceClass("x-layout-active-content", "x-layout-inactive-content");
    }
},getToolbar:function() {
    return this.toolbar;
},setActiveState:function(_5) {
    this.active = _5;
    if (!_5) {
        this.fireEvent("deactivate", this);
    } else {
        this.fireEvent("activate", this);
    }
},setContent:function(_6, _7) {
    this.el.update(_6, _7);
},ignoreResize:function(w, h) {
    if (this.lastSize && this.lastSize.width == w && this.lastSize.height == h) {
        return true;
    } else {
        this.lastSize = {width:w,height:h};
        return false;
    }
},getUpdateManager:function() {
    return this.el.getUpdateManager();
},load:function() {
    var um = this.el.getUpdateManager();
    um.update.apply(um, arguments);
    return this;
},setUrl:function(_b, _c, _d) {
    if (this.refreshDelegate) {
        this.removeListener("activate", this.refreshDelegate);
    }
    this.refreshDelegate = this._handleRefresh.createDelegate(this, [_b,_c,_d]);
    this.on("activate", this.refreshDelegate);
    return this.el.getUpdateManager();
},_handleRefresh:function(_e, _f, _10) {
    if (!_10 || !this.loaded) {
        var _11 = this.el.getUpdateManager();
        _11.update(_e, _f, this._setLoaded.createDelegate(this));
    }
},_setLoaded:function() {
    this.loaded = true;
},getId:function() {
    return this.el.id;
},getEl:function() {
    return this.el;
},adjustForComponents:function(_12, _13) {
    if (this.resizeEl != this.el) {
        _12 -= this.el.getFrameWidth("lr");
        _13 -= this.el.getFrameWidth("tb");
    }
    if (this.toolbar) {
        var te = this.toolbar.getEl();
        _13 -= te.getHeight();
        te.setWidth(_12);
    }
    if (this.adjustments) {
        _12 += this.adjustments[0];
        _13 += this.adjustments[1];
    }
    return{"width":_12,"height":_13};
},setSize:function(_15, _16) {
    if (this.fitToFrame && !this.ignoreResize(_15, _16)) {
        if (this.fitContainer && this.resizeEl != this.el) {
            this.el.setSize(_15, _16);
        }
        var _17 = this.adjustForComponents(_15, _16);
        this.resizeEl.setSize(this.autoWidth ? "auto" : _17.width, this.autoHeight ? "auto" : _17.height);
        this.fireEvent("resize", this, _17.width, _17.height);
    }
},getTitle:function() {
    return this.title;
},setTitle:function(_18) {
    this.title = _18;
    if (this.region) {
        this.region.updatePanelTitle(this, _18);
    }
},isClosable:function() {
    return this.closable;
},beforeSlide:function() {
    this.el.clip();
    this.resizeEl.clip();
},afterSlide:function() {
    this.el.unclip();
    this.resizeEl.unclip();
},refresh:function() {
    if (this.refreshDelegate) {
        this.loaded = false;
        this.refreshDelegate();
    }
},destroy:function() {
    this.el.removeAllListeners();
    var _19 = document.createElement("span");
    _19.appendChild(this.el.dom);
    _19.innerHTML = "";
    this.el.remove();
    this.el = null;
}});
Ext.GridPanel = function(_1a, _1b) {
    this.wrapper = Ext.DomHelper.append(document.body, {tag:"div",cls:"x-layout-grid-wrapper x-layout-inactive-content"}, true);
    this.wrapper.dom.appendChild(_1a.getGridEl().dom);
    Ext.GridPanel.superclass.constructor.call(this, this.wrapper, _1b);
    if (this.toolbar) {
        this.toolbar.el.insertBefore(this.wrapper.dom.firstChild);
    }
    _1a.monitorWindowResize = false;
    _1a.autoHeight = false;
    _1a.autoWidth = false;
    this.grid = _1a;
    this.grid.getGridEl().replaceClass("x-layout-inactive-content", "x-layout-component-panel");
};
Ext.extend(Ext.GridPanel, Ext.ContentPanel, {getId:function() {
    return this.grid.id;
},getGrid:function() {
    return this.grid;
},setSize:function(_1c, _1d) {
    if (!this.ignoreResize(_1c, _1d)) {
        var _1e = this.grid;
        var _1f = this.adjustForComponents(_1c, _1d);
        _1e.getGridEl().setSize(_1f.width, _1f.height);
        _1e.autoSize();
    }
},beforeSlide:function() {
    this.grid.getView().scroller.clip();
},afterSlide:function() {
    this.grid.getView().scroller.unclip();
},destroy:function() {
    this.grid.destroy();
    delete this.grid;
    Ext.GridPanel.superclass.destroy.call(this);
}});
Ext.NestedLayoutPanel = function(_20, _21) {
    Ext.NestedLayoutPanel.superclass.constructor.call(this, _20.getEl(), _21);
    _20.monitorWindowResize = false;
    this.layout = _20;
    this.layout.getEl().addClass("x-layout-nested-layout");
};
Ext.extend(Ext.NestedLayoutPanel, Ext.ContentPanel, {setSize:function(_22, _23) {
    if (!this.ignoreResize(_22, _23)) {
        var _24 = this.adjustForComponents(_22, _23);
        var el = this.layout.getEl();
        el.setSize(_24.width, _24.height);
        var _26 = el.dom.offsetWidth;
        this.layout.layout();
        if (Ext.isIE && !this.initialized) {
            this.initialized = true;
            this.layout.layout();
        }
    }
},getLayout:function() {
    return this.layout;
}});
Ext.ScrollPanel = function(el, _28, _29) {
    _28 = _28 || {};
    _28.fitToFrame = true;
    Ext.ScrollPanel.superclass.constructor.call(this, el, _28, _29);
    this.el.dom.style.overflow = "hidden";
    var _2a = this.el.wrap({cls:"x-scroller x-layout-inactive-content"});
    this.el.removeClass("x-layout-inactive-content");
    this.el.on("mousewheel", this.onWheel, this);
    var up = _2a.createChild({cls:"x-scroller-up",html:"&#160;"}, this.el.dom);
    var _2c = _2a.createChild({cls:"x-scroller-down",html:"&#160;"});
    up.unselectable();
    _2c.unselectable();
    up.on("click", this.scrollUp, this);
    _2c.on("click", this.scrollDown, this);
    up.addClassOnOver("x-scroller-btn-over");
    _2c.addClassOnOver("x-scroller-btn-over");
    up.addClassOnClick("x-scroller-btn-click");
    _2c.addClassOnClick("x-scroller-btn-click");
    this.adjustments = [0,-(up.getHeight() + _2c.getHeight())];
    this.resizeEl = this.el;
    this.el = _2a;
    this.up = up;
    this.down = _2c;
};
Ext.extend(Ext.ScrollPanel, Ext.ContentPanel, {increment:100,wheelIncrement:5,scrollUp:function() {
    this.resizeEl.scroll("up", this.increment, {callback:this.afterScroll,scope:this});
},scrollDown:function() {
    this.resizeEl.scroll("down", this.increment, {callback:this.afterScroll,scope:this});
},afterScroll:function() {
    var el = this.resizeEl;
    var t = el.dom.scrollTop,h = el.dom.scrollHeight,ch = el.dom.clientHeight;
    this.up[t == 0 ? "addClass" : "removeClass"]("x-scroller-btn-disabled");
    this.down[h - t <= ch ? "addClass" : "removeClass"]("x-scroller-btn-disabled");
},setSize:function() {
    Ext.ScrollPanel.superclass.setSize.apply(this, arguments);
    this.afterScroll();
},onWheel:function(e) {
    var d = e.getWheelDelta();
    this.resizeEl.dom.scrollTop -= (d * this.wheelIncrement);
    this.afterScroll();
    e.stopEvent();
},setContent:function(_33, _34) {
    this.resizeEl.update(_33, _34);
}});

Ext.ReaderLayout = function(_1, _2) {
    var c = _1 || {size:{}};
    Ext.ReaderLayout.superclass.constructor.call(this, _2 || document.body, {north:c.north !== false ? Ext.apply({split:false,initialSize:32,titlebar:false}, c.north) : false,west:c.west !== false ? Ext.apply({split:true,initialSize:200,minSize:175,maxSize:400,titlebar:true,collapsible:true,animate:true,margins:{left:5,right:0,bottom:5,top:5},cmargins:{left:5,right:5,bottom:5,top:5}}, c.west) : false,east:c.east !== false ? Ext.apply({split:true,initialSize:200,minSize:175,maxSize:400,titlebar:true,collapsible:true,animate:true,margins:{left:0,right:5,bottom:5,top:5},cmargins:{left:5,right:5,bottom:5,top:5}}, c.east) : false,center:Ext.apply({tabPosition:"top",autoScroll:false,closeOnTab:true,titlebar:false,margins:{left:c.west !== false ? 0 : 5,right:c.east !== false ? 0 : 5,bottom:5,top:2}}, c.center)});
    this.el.addClass("x-reader");
    this.beginUpdate();
    var _4 = new Ext.BorderLayout(Ext.get(document.body).createChild(), {south:c.preview !== false ? Ext.apply({split:true,initialSize:200,minSize:100,autoScroll:true,collapsible:true,titlebar:true,cmargins:{top:5,left:0,right:0,bottom:0}}, c.preview) : false,center:Ext.apply({autoScroll:false,titlebar:false,minHeight:200}, c.listView)});
    this.add("center", new Ext.NestedLayoutPanel(_4, Ext.apply({title:c.mainTitle || "",tabTip:""}, c.innerPanelCfg)));
    this.endUpdate();
    this.regions.preview = _4.getRegion("south");
    this.regions.listView = _4.getRegion("center");
};
Ext.extend(Ext.ReaderLayout, Ext.BorderLayout);
