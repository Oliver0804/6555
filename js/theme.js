module.exports = {
  data: function() {
    return {
      pageType: '',
      modAdmins: [],
      pageAdmins: [],
      focusedPersonalInfo: null,
      focusedPersonalPassword: null,
      focusedModule: null,
      keyInGroup: '',
      keyInUser: '',
      nkeyInUser: '',
      groupSeeker: [],
      userSeeker: [],
      map: {},
      focusedPage: null,
      inEditMode: false,
      viewMode: true,
      tree: [],
      viewTree: [],
      focusedSite: null,
      focusedPermissionDMap: null,
      focusedPermissionPage: null,
      focusedPermissionSiteDMap: null,
      focusedSubSite: null,
      focusedSubSiteList: [],
      pageSeo: [],
      recyling: [],
      patternClick: false,
      focusedTheme: null,
      patternCount: 1,
      langHasFocus: false,
      focusItem: '',
      recycleList: []
    }
  },
  computed: {
    top: {
      get: function() {
        return this.ct$getAnchor('top');
      },
      set: function(array) {
        var self = this;
        this.setPage(array).then(function () {
          self.ct$setAnchor('top', array);
        })
      },
    },
    middle: {
      get: function() {
        return this.ct$getAnchor('middle');
      },
      set: function(array) {
        var self = this;
        this.setPage(array).then(function () {
          self.ct$setAnchor('middle', array);
        })
      },
    },
    left: {
      get: function() {
        return this.ct$getAnchor('left');
      },
      set: function(array) {
        var self = this;
        this.setPage(array).then(function () {
          self.ct$setAnchor('left', array);
        })
      },
    },
    right: {
      get: function() {
        return this.ct$getAnchor('right');
      },
      set: function(array) {
        var self = this;
        this.setPage(array).then(function () {
          self.ct$setAnchor('right', array);
        })
      },
    },
    bottom: {
      get: function() {
        return this.ct$getAnchor('bottom');
      },
      set: function(array) {
        var self = this;
        this.setPage(array).then(function () {
          self.ct$setAnchor('bottom', array);
        })
      },
    },
    focusedModulePermission: function() {
      var self = this;

      var arr = [].concat(this.focusedModule.admins, this.focusedModule.admins_groups, this.focusedModule.editors, this.focusedModule.edit_groups);

      if (arr[0] && arr[0]._id) {
        arr.forEach(function(item) {
          var x = self.modAdmins.find(function(obj) { return obj._id == item._id });
          !x ? self.modAdmins.push({
            _id: item._id,
            module_id: [self.focusedModule._id],
            obj: item,
            status: self.ct$getPermission(self.focusedModule, item)
          }) : [
            x.status = self.ct$getPermission(self.focusedModule, item),
            !(x.module_id.find(function(ids) { return ids == self.focusedModule._id })) ?
            x.module_id.push(self.focusedModule._id) : ''
          ];

          self.setVal('$p' + item._id, self.ct$getPermission(self.focusedModule, item))
        });
        return this.modAdmins;
      } else {
        arr.forEach(function(item) {
          self.setVal('$p' + item._id, self.ct$getPermission(self.focusedModule, item))
        });
        return arr;
      }
    },
    focusedPagePermission: function() {
      var self = this;
      var arr = [].concat(this.focusedPage.admins, this.focusedPage.admins_groups);

      if (arr[0] && arr[0]._id) {
        arr.forEach(function(item) {
          var x = self.pageAdmins.find(function(obj) {
            return obj._id == item._id
          });
          !x ? self.pageAdmins.push({
            _id: item._id,
            page_id: [self.focusedPage._id],
            obj: item,
            status: self.ct$getPermission(self.focusedPage, item)
          }) : [
            x.status = self.ct$getPermission(self.focusedPage, item),
            !(x.page_id.find(function(ids) {
              return ids == self.focusedPage._id
            })) ?
            x.page_id.push(self.focusedPage._id) :
            ''
          ];

          self.setVal('$p' + item._id, self.ct$getPermission(self.focusedPage, item))
        });
        return this.pageAdmins;
      } else {
        arr.forEach(function(item) {
          self.setVal('$p' + item._id, self.ct$getPermission(self.focusedPage, item))
        });
        return arr;
      }
    },
    exampleImg: function() {
      if (!this.focusedTheme) return '';
      return this.ct$getPackagePath(this.focusedTheme) + '/img/example/preview' + this.patternCount + '.jpg';
    },
    statisticPath: function() {
      var paths = window.location.pathname.split('/')
      var idx = paths.indexOf('s')
      var sname =idx !== -1 ? paths[idx+1] : 'main'
      return '/' + sname + '/statistic/home'
    }
  },
  watch: {
    focusedPage: function() {
      if (!this.focusedPage) return;
      if (!this.focusedPage.pageTypeNo) this.focusedPage.pageTypeNo = 0;
    }
  },
  methods: {
    jsonErrorHandler: function(promise, j) {
      var self = this;
      var jump = typeof j == "undefined" ? true : j;
      return promise.then(function(xhr) {
        console.log(xhr);
        if (xhr.status != 200) throw new Error('connection-error');
        var json = xhr.data;
        if (!jump) return json;
        if (json.error !== 0) throw new Error(json.msg);
        return json.data;
      })['catch'](function(err) {
        self.$notify("alert", 'error', 'error');
        throw err;
      });
    },
    langFocus: function(langFocus) {
      this.langHasFocus = langFocus;
    },
    patternChange: function(val) {
      this.patternCount = this.patternCount + val;
      if (this.patternCount < 1) this.patternCount = 1;
      if (this.patternCount > 3) this.patternCount = 3;
    },
    cleanAll: function() {
      this.setVal('nuserState', false);
      this.setVal('nsubSiteLang', false);
      //群組的下拉狀態
      this.setVal('groupState', false);
      //使用者的下拉狀態 
      this.setVal('userState', false);
      //選擇群組或者個人
      this.setVal('GUstate', false);
      //模組寬度
      if (this.focusedModule) this.$set(this.focusedModule, 'Wstate', false);
      //語系
      this.setVal('subSiteLang', false);
      //頁面的下拉狀態
      this.$refs.toggle1 ? this.$refs.toggle1.classList.remove('select-focus') : ''
      this.$refs.toggle2 ? this.$refs.toggle2.classList.remove('select-visible') : ''
    },
    toKeyInGroup: function() {
      var self = this;
      this.ct$getGroupsByName(this.keyInGroup).then(function(data) {
        self.groupSeeker = data;
        self.setVal('groupState', true);
      });
    },
    toKeyInUser: function(type) {
      var self = this;
      this.ct$getUsersByName(this.keyInUser).then(function(data) {
        self.userSeeker = data;
        if (type == 'n') {
          self.setVal('nuserState', true);
        } else {
          self.setVal('userState', true);
        }
      });
    },
    getViewTree: function() {
      this.viewTree = this.ct$getTree('', 'hide');
    },
    getTree: function() {
      this.tree = this.ct$getTree();
    },
    setVal: function(key, val) {
      var self = this;
      if (key === 'focusedPage' || key === 'leftBarState') {
        this.focusedPersonalInfo = this.ct$getPersonalInfo();
        this.focusedPersonalPassword = {};
      }
      if (key === 'language') {
        this.$i18n.locale = val;
      }
      if (key === 'GUSelected') {
        this.setVal('GUstate', false)
      }
      if (key === 'leftBar') {
        this.inEditMode = val && (this.ct$isSiteAdmin || this.ct$isPageAdmin);
        this.viewMode = val;
      }
      if (key === 'focusedPage') {
        if (val === 'settings' || val === 'setSeo' || val === 'setFooter') this.focusedSite = this.ct$getSite();
        if (val === 'sitemap') {
          var t = window.document.title
          var ary = t.split('-').map(function(v) {
            return v.trim();
          });
          ary[1] = '網站導覽';
          window.document.title = ary.join(' - ');
		  self.$refs.jumpToCenter.focus();
        }
      }
      return this.$set(this.map, key, val);
    },
    getVal: function(key) {
      return this.map[key];
    },
    delVal: function() {
      return this.$set(this.map, key, null);
    },
    eqVal: function(key, val) {
      return this.getVal(key) == val;
    },
    setPassowrd: function() {
      if (this.inputNewPassword != this.inputCheckNewPassword) return false;
      return ct$setUserPassword(this.inputPassword, this.inputNewPassword);
    },
    publishDMap: function() {
      var self = this;
      this.ct$publishDMap().then(function() {
        self.$notify('alert', self.$t('alert.save'), 'success');
      })
    },
    focuseModule: function(module) {
      this.keyInGroup = '';
      this.keyInUser = '';
      this.map['GUSelected'] = '';
      var self = this;
      this.ct$getModuleDetail(module).then(function(data) {
        self.focusedModule = data;
        self.setVal('focusedPage', 'modFrame');
      });
    },
    insertPage: function(page) {
      var self = this;
      self.focusedPage = this.ct$insertPage(page);
      self.setVal('focusedPage', 'pageAdvanced');
    },
    editPage: function(page) {
      this.keyInGroup = '';
      this.keyInUser = '';
      this.map['GUSelected'] = '';
      var self = this;
      this.ct$getPageDetail(page).then(function(data) {
        self.focusedPage = data;
        self.setVal('focusedPage', 'pageAdvanced');
      });
    },
    updatePage: function() {
      var self = this;
      if (this.focusedPage.pageTypeNo == 1) {

        if (!this.focusedPage.name.match(/^(http(s)?\:\/\/)/)) return self.$notify('alert', '頁面連結格式錯誤', 'warn');
      }
      this.ct$updatePage(this.focusedPage).then(function() {
        self.setVal('focusedPage', 'page');
        self.getTree();
        self.getViewTree();
        self.$notify('alert', self.$t('alert.save'), 'success');
      });
    },
    deletePage: function() {
      var self = this;
      if (confirm(this.$t('alert.deletaOrNo'))) {
        this.ct$deletePage(this.focusedPage).then(function() {
          self.setVal('focusedPage', 'page');
          self.getTree();
          self.getViewTree();
          self.$notify('alert', self.$t('alert.del'), 'success');
        });
      }
    },
    selectGroup: function(g) {
      this.keyInGroup = g.name;
      this.setVal('groupState', false);
      this.setVal('userState', false);
      this.setVal('selectedItem', g);
    },
    selectUser: function(u) {
      this.keyInUser = u.username;
      this.setVal('groupState', false);
      this.setVal('userState', false);
      this.setVal('selectedItem', u);
    },
    confirmSelectModuleItems: function() {
      var item = this.getVal('selectedItem');
      if (!item) return false;
      this.setModulePermission(item, 'manage');
      this.setVal('groupState', false);
      this.setVal('userState', false);
      this.setVal('selectedItem', null);
    },
    setModulePermission: function(item, permission) {
      var self = this;
      if (permission === false) {
        var x = this.modAdmins.find(function(obj) {
          return obj._id == item._id;
        })
        x.module_id = x.module_id.filter(function(id) {
          return id !== self.focusedModule._id
        })
      }
      var m = this.ct$setPermission(this.focusedModule, item, permission);
      this.focusedModule = m;
      console.log(this.focusedModule);
    },
    deleteModule: function(module) {
      var self = this;
      if (confirm(this.$t('alert.deletaOrNo'))) {
        this.ct$deleteModule(module).then(function() {
          self.$notify('alert', self.$t('alert.del'), 'success');
          self.setVal('focusedPage', 'gadget');
        })
      }
    },
    recycleModule: function() {
      var self = this;
      if (confirm('是否回收?')) {
        var newArray = this.ct$getAnchor('recycle');
        newArray.push(this.focusedModule);
        this.updateAnchor('recycle').then(function() {
          self.$notify('alert', self.$t('alert.del'), 'success');
          self.setVal('focusedPage', 'gadget');
        })
      }
    },
    updateAnchor: function(name) {
      var currentItems = this.ct$getAnchor(name);
      var item = JSON.parse(JSON.stringify(this.focusedModule));
      item.anchor = name;
      item.admins = this.focusedModule.admins.map(function(item) {
        return item._id
      });
      item.admins_groups = this.focusedModule.admins_groups.map(function(item) {
        return item._id
      });
      item.restricts_group = this.focusedModule.restricts_group.map(function(item) {
        return item._id;
      });
      item.restricts = this.focusedModule.restricts.map(function(item) {
        return item._id;
      });
      item.editors = this.focusedModule.editors.map(function(item) {
        return item._id;
      });
      item.edit_groups = this.focusedModule.edit_groups.map(function(item) {
        return item._id;
      });
      delete item.token;

      item.setting.seq = currentItems.length;
      var array = [item];
      var self = this;
      var site = this.ct$currentSite.upath;
      var page = this.ct$currentPage.name;
      var url = ['/nss/site', site, 'page', page, 'deploy/temp'].join('/');
      var p = axios.post(url, array);
      return self.jsonErrorHandler(p).then(function(data) {
        var f = self.ct$DMap.filter(function(deployedMod) {
          return deployedMod._id !== item._id;
        });
        var arr = [].concat(f, data);
        self.ct$DMap = arr;
      });
    },
    updateModule: function() {
      var self = this;
      this.ct$updateModule(this.focusedModule).then(function() {
        self.$notify('alert', self.$t('alert.save'), 'success');
        self.setVal('focusedPage', 'gadget');
      })
    },
    copyTokenToClipboard: function() {
      this.$refs.shortcut.select();
      if (document.execCommand('copy')) document.execCommand('copy');
    },
    confirmSelectPageItems: function() {
      var item = this.getVal('selectedItem');
      if (!item) return false;
      this.setPagePermission(item, 'manage');
      this.setVal('groupState', false);
      this.setVal('userState', false);
      this.setVal('selectedItem', null);
    },
    setPagePermission: function(item, permission) {
      var self = this;
      if (permission === false) {
        var x = this.pageAdmins.find(function(obj) {
          return obj._id == item._id;
        })
        x.page_id = x.page_id.filter(function(id) {
          return id !== self.focusedPage._id
        })
      }
      var m = this.ct$setPermission(this.focusedPage, item, permission);
      this.focusedPage = m;
    },
    dragPage: function(e) {
      var self = this;
      this.ct$updatePageTree(this.tree).then(function() {
        self.getTree();
        self.getViewTree();
      })
    },
    setTheme: function(theme) {
      var self = this;
      if (confirm(this.$t('alert.changetemplate'))) {
        this.ct$setTheme(theme).then(function() {
          window.location.reload();
        })
      }
    },
    upLogo: function(e) {
      var files = e.target.files || e.dataTransfer.files,
        self = this;
      var formData = new FormData();
      if (!files.length)
        return;
      for (var i = 0; i < files.length; i++) {
        formData.append('image', files[i]);
      }
      this.ct$upimage(formData).then(function(path) {
        self.$set(self.focusedSite.logo, 'img', path);
      })
    },
    upFavicon: function(e) {
      var files = e.target.files || e.dataTransfer.files,
        self = this;
      var formData = new FormData();
      if (!files.length)
        return;
      for (var i = 0; i < files.length; i++) {
        formData.append('image', files[i]);
      }
      this.ct$upimage(formData).then(function(path) {
        self.$set(self.focusedSite.logo, 'favicon', path);
      })
    },
    updateSite: function() {
      var self = this;
      this.ct$updateSite(this.focusedSite)
        .then(function(data) {
          self.$notify('alert', self.$t('alert.save'), 'success');
          self.setVal('focusedPage', 'gadget');
        })
    },
    updateFooter: function() {
      var self = this;
      this.ct$updateFooter(this.focusedSite)
        .then(function(data) {
          self.$notify('alert', self.$t('alert.save'), 'success');
          self.setVal('focusedPage', 'gadget');
        })
    },
    toPermissionDetail: function(data) {
      var self = this;
      this.ct$getPermissionDetail(data)
        .then(function(ary) {
          self.focusedPermissionPage = ary[0];
          self.focusedPermissionDMap = ary[1];
          self.setVal('focusedPage', 'permissionDetail');
        })
    },
    updatePermissionDetail: function() {
      var self = this;
      this.ct$updatePermissionDetail(this.focusedPermissionPage, this.focusedPermissionDMap)
        .then(function() {
          self.$notify('alert', self.$t('alert.save'), 'success');
          self.setVal('focusedPage', 'permission');
        })
    },
    focusePermission: function() {
      var self = this;
      if (!this.ct$isSiteAdmin) {
        this.ct$getSitePermission().then(function(data) {
          self.focusedPermissionSiteDMap = data;
          self.setVal('focusedPage', 'permission');
        })
      } else {
        self.setVal('focusedPage', 'permission');
      }
    },
    updateEmail: function() {
      var self = this;
      if(!/(.+)@(.+){2,}\.(.+){2,}/.test(this.focusedPersonalInfo.email)){
        return this.$notify("alert", this.$t('error.emailFormat'), 'error');
      } 
      this.ct$setUserEmail(this.focusedPersonalInfo).then(function() {
        self.setVal('focusedPage', 'gadget');
        self.$notify('alert', self.$t('alert.email'), 'success');
      })
    },
    updatePassword: function() {
      var self = this;
      if(this.focusedPersonalInfo.username === this.focusedPersonalPassword.NewPassword) {
        return this.$notify("alert", this.$t('error.passwordSame'), 'error');
      }
      if(!/^((?=.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*|(?=.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!#$%&'()*+,.\/:;<=>?@[\]\^_`{|}~-]).*|(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[!#$%&'()*+,.\/:;<=>?@[\]\^_`{|}~-]).*)/gm.test(this.focusedPersonalPassword.NewPassword)) {
        return this.$notify("alert", this.$t('error.passwordFormat'), 'error');
      }
      if(this.focusedPersonalPassword.NewPassword !== this.focusedPersonalPassword.CheckNewPassword){
        return this.$notify("alert", this.$t('error.confirmWrong'), 'error');
      }
      this.ct$setUserPassowrd(this.focusedPersonalPassword).then(function() {
        self.setVal('focusedPage', 'gadget');
        self.$notify('alert', self.$t('alert.pwd'), 'success');
      })
    },
    focuseSubSite: function() {
      var self = this;
      this.focusedSubSite = {};
      this.ct$getSubSite().then(function(list) {
        self.focusedSubSiteList = list;
        self.setVal('focusedPage', 'subSite');
      })
    },
    insertSubSite: function() {
      var self = this;
      var c = confirm('基於信賴原則與合理使用範圍，獨立網址的子站，其開設與內容建立，僅提供機關／學校之各處室網站、班級網站、活動網站、社團網站、學科網站，不得另作為其他單一機關／學校首頁之用。若您違反前述之使用範圍時，本公司具有終止獨立網址使用、停止子站服務之權力。\n\n  我已充分理解並同意');
      if (c) {
        this.ct$insertSubSite(this.focusedSubSite).then(function(list) {
          self.focusedSubSite = {};
          self.focusedSubSiteList = list;
          self.$notify('alert', self.$t('alert.save'), 'success');
        })
      }
    },
    updateSubSite: function(site) {
      var self = this;
      if (this.focusedSubSiteList.filter(function(item) {
          return item.enabled
        }).length > this.ct$installed.data.siteserver.subsite) {
        site.enabled = false;
        self.$notify('alert', self.$t('alert.subSiteOver'), 'error');
        return false;
      }
      this.ct$updateSubSite(self.focusedSubSiteList, site).then(function(list) {
        self.focusedSubSite = {};
        self.focusedSubSiteList = list;
        self.$notify('alert', self.$t('alert.edit'), 'success');
        self.setVal('subSiteState', false);
      })
    },
    delSubSite: function(site) {
      var self = this;
      if (confirm('是否刪除子站')) {
        this.ct$delSubSite(self.focusedSubSiteList, site).then(function(list) {
          self.focusedSubSite = {};
          self.focusedSubSiteList = list;
          self.$notify('alert', self.$t('alert.del'), 'success');
        })
      }
    },
    setAdmins: function(subSite) {
      if (subSite) {
        subSite = this.ct$setAdmins(subSite);
      } else {
        this.focusedSubSite = this.ct$setAdmins(this.focusedSubSite);
      }
      this.keyInUser = '';
      this.nkeyInUser = '';
    },
    delAdmins: function(admin, subSite) {
      if (subSite) {
        subSite = this.ct$delAdmins(subSite, admin);
      } else {
        this.focusedSubSite = this.ct$delAdmins(this.focusedSubSite, admin);
      }
    },
    addKeyword: function() {
      if (this.focusedPage.pageKey.trim()) {
        var seo = this.ct$addKeyword(this.focusedPage.seo, this.focusedPage.pageKey);
        this.focusedPage.seo = seo;
        this.focusedPage.pageKey = '';
      } else {
        this.$notify('alert', this.$t('alert.blank'), 'warn');
      }
    },
    delKeyword: function(item) {
      var seo = this.ct$delKeyword(this.focusedPage.seo, item);
      this.focusedPage.seo = seo;
    },
    delFavicon: function() {
      this.focusedSite.logo.favicon = '';
    },
    delLogo: function() {
      this.focusedSite.logo.img = '';
    },
    displayLogo: function() {
      var display = 'show';
      if (this.focusedSite.logo.display === 'show') display = 'hide';
      this.$set(this.focusedSite.logo, 'display', display);
    },
    setLayout: function(layout) {
      var self = this;
      if (confirm(self.$t('alert.changethislayout'))) {
        this.ct$setPageLayout(layout).then(function() {
          self.$notify('confirm', '<div class="title">' + self.$t('alert.layoutconfirm') + '<div class="close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path></svg></div></div><div class="content">' + self.$t('alert.recycledgadget') + '</div>', null, 0);
        })
      }
    },
    setModuleWidth: function() {
      var self = this;
      if (confirm(self.$t('alert.changethisadvanced'))) {
        this.ct$setModuleWidth().then(function() {
          self.$notify('confirm', '<div class="title">' + self.$t('alert.layoutconfirm') + '<div class="close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path></svg></div></div><div class="content">' + self.$t('alert.recycledgadget') + '</div>', null, 0);
        })
      }
    },
    setSiteLayout: function(layout) {
      var self = this;
      if (confirm(self.$t('alert.changealllayout'))) {
        this.ct$setSiteLayout(layout).then(function() {
          self.$notify('confirm', '<div class="title">' + self.$t('alert.layoutdefaultconfirm') + '<div class="close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path></svg></div></div><div class="content">' + self.$t('alert.recycledgadget') + '</div>', null, 0);
        })
      }
    },
    focuseRecyling: function() {
      var self = this;
      var list = [];
      // form api anchor is 'recycle'
      var p1 = this.getRecycleList();
      // chk ctDmap[].anchor is display on screen or not ?
      var hideMods = [];
      this.ct$DMap.forEach(function(item) {
        if (item.anchor !== 'recycle') {
          /*old
          if(!self.ct$currentPage.anchors[item.anchor].display){
          */
          /*20191005 new*/
          if (!self.ct$currentPage.anchors || !self.ct$currentPage.anchors[item.anchor] || !self.ct$currentPage.anchors[item.anchor].display) {
            hideMods.push(item);
          }
        }
      })
      Promise.all([p1]).then(function(res) {
        var ary = [];
        var mods = res[0].filter(function(item) { return !item.destroy });
        var pages = JSON.parse(JSON.stringify(self.ct$allPage));
        pages.forEach(function(item, index) {
          ary.push({
            pageId: item._id,
            pageLink: item.name,
            pageName: item.heading,
            currentPage: item._id === self.ct$currentPage._id,
            mods: []
          })

          mods.forEach(function(ele) {
            if (ele.page === item._id) {
              ary[index].mods.push(ele);
            }
          });
          if (ary[index].pageId === self.ct$currentPage._id) {
            ary[index].mods = [].concat(ary[index].mods, hideMods);
          }
        });
        self.recycleList = ary;
        self.setVal('focusedPage', 'recycling');
      });
    },
    getRecycleList: function() {
      var self = this;
      var site = this.ct$currentSite.upath;
      var data = axios.get('/nss/module/recycle/' + site);
      return data.then(function(res) {
        if (res.status !== 200) throw new Error('connection-error');
        var json = res.data;
        if (json.error !== 0) throw new Error(json.msg);
        return json.data;
      })['catch'](function(err) {
        console.log(err);
        //app.$notify("alert", '錯誤', 'error');
        throw err;
      });
    },
    setPage: function(array) {
      var site = this.ct$currentSite._id;
      var page = this.ct$currentPage._id;
      var wait = array.map(function (item) {
        var id = item._id;
        return axios.post('/nss/module/recycling', {
          id: id,
          warp_to_site: site,
          warp_to_page: page
        });
      })
      return Promise.all(wait);
    },
    patternClickOn: function(item) {
      this.patternCount = 1;
      this.patternClick = true;
      this.focusedTheme = item;
    },
    patternClickOff: function() {
      this.patternClick = false;
    },
    selectPageType: function($e) {
      $e.target.parentNode.classList.toggle('select-focus');
      $e.target.parentNode.nextElementSibling.classList.toggle('select-visible');
    },
    setFontSize: function(str) {
      var html = document.getElementsByTagName('html')[0];
      return html.style.fontSize = str;
    },
    toggleLeftBar: function() {
      this.map.leftBar ? this.map.leftBar = false : this.map.leftBar = true;
      if (!this.viewMode) this.map.leftBar = false;
    },
    getlr: function() {
      return this.map.leftBar ? 'scale(1,1)' : 'scale(-1,1)';
    }
  },
  created: function() {
    var self = this;
    this.setVal('fontSize', '1rem');
    this.setVal('language', this.ct$currentSite.lang);
    this.setVal('indexTree', this.ct$getTree('root'));
    this.setVal('leftBar', true);
    this.setVal('leftBarState', 'user');
    this.setVal('focusedPage', 'gadget');
    this.setVal('cr-open', true);
    this.getTree();
    this.getViewTree();
  },
  mounted: function() {
    this.cleanAll();
    var hash = window.location.hash;
    var focuseOnPage = 'gadget';
    if (hash == '#arearecycling') {
      this.focuseRecyling();
      this.setVal('focusedPage', 'recycling')
    }
    if (hash == '#sitemap') {
      focuseOnPage = 'sitemap';
    }
    this.setVal('focusedPage', focuseOnPage);
    this.map.leftBar = false;
		if(/[\?&]over/.test(window.location.href)) {
      this.$notify('alert',this.$t('error.over90days'),'warning')
		}
  }
}