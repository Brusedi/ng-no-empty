angular.module("app", ["templates"])
  .directive("app", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/app.tpl.html",
      controller: ["$scope", "$element", appDataCtrl],
    };
    function appDataCtrl($scope, $element) {

      $scope.data = ( () => { console.log('initializing data....') ; return makeDefaulData();} )()
      $scope.dataFiltered = ( titleFilter = $scope.findBy ) => $scope.data.filter( x => x.title.includes(titleFilter) ) 

      const uniqueTags =  (dt = $scope.data) => dt.reduce( (a,x) => a.concat(x.tags), [] ).filter( (v,i,s) => s.indexOf(v) === i ) 
      const lastDateElement = () => $scope.data.reduce( (a,x) => a && new Date(a.date) > new Date(x.date) ? a : x , undefined )
      const createItem = (title) => ({id: makeDataId(), title: title, tags:[], date: (new Date()).toJSON() }) ;

      $scope.currentItem;
      $scope.isShowTime=true;
      $scope.sortBy= 'title';
      $scope.findBy = '';
      $scope.newItemLabel = '';
      $scope.uniqueTags = uniqueTags();
      $scope.lastDateElement = lastDateElement();
            
      $scope.setCurrent = ( item ) => $scope.currentItem = item ;
      $scope.getItemById = ( id = $scope.currentItem ) => $scope.data.find( i => i.id === id ) ;
      $scope.addItem = () => { $scope.data.push( createItem( $scope.newItemLabel ) );  $scope.lastDateElement = lastDateElement() };
      $scope.delCurItemTagByIndex = (tagIndex) => {  $scope.getItemById().tags.splice(tagIndex, 1) ;   $scope.uniqueTags =  uniqueTags(); }
      $scope.addCurItemTag = ( tag ) => {  $scope.getItemById().tags.push(tag) ; $scope.uniqueTags =  uniqueTags(); }

    }
  })
  .directive("contentView", () => {
    return {
      scope: {ctrlScope : "=ctrlscope"  },
      restrict: "E",
      templateUrl: "./js/app/content-view.tpl.html",
    };
  })

  .directive("sidebarView", () => {
    return {
      scope: {ctrlScope : "=ctrlscope"  },
      restrict: "E",
      templateUrl: "./js/app/sidebar-view.tpl.html",
      controller: ["$scope", "$element", sidebarViewCtrl],
    };
    function sidebarViewCtrl($scope, $element) {
      $scope.tag; 
      $scope.addTag = () =>{  $scope.ctrlScope.addCurItemTag($scope.tag);  $scope.tag = ''}
    }  
  })

  .directive("elementsView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/elements-view.tpl.html",
      controller: ["$scope", "$element", elementsViewCtrl],
    };
    function elementsViewCtrl($scope, $element) {
      $scope.model = {
        width: 300,
      };
      $scope.setWidth = () => {
        let width = $scope.model.width;
        if (!width) {
          width = 1;
          $scope.model.width = width;
        }
        $element.css("width", `${width}px`);
      };
      $scope.setWidth();
    }
  })

  .directive("some1", () => {
    return {
      scope: {ctrlScope : "=ctrlscope"  },
      restrict: "E",
      template:"<some-2 ctrlscope = 'ctrlScope' > </some-2>" 
    };
  })

  .directive("some2", () => {
    return {
      scope: { ctrlScope : "=ctrlscope"  },
      restrict: "E",
      template:"<some-3 ctrlscope = 'ctrlScope'></some-3>"
    };
  })

  .directive("some3", () => {
    return {
      scope: {ctrlScope : "=ctrlscope"},
      restrict: "E",
      template:"<summary-view lastelement = 'ctrlScope.lastDateElement'  tags = 'ctrlScope.uniqueTags'   ></summary-view> "
    };
  })

  .directive("summaryView", () => {
    return {
      scope: { lastDateElement : "=lastelement", uniqueTags : "=tags"  },
      restrict: "E",
      templateUrl: "./js/app/summary-view.tpl.html",
    };
  });

