/**
 * Created by felix on 10/29/14.
 */
application.factory('DefaultResoure', ['PhoebeResource', function (PhoebeResource) {
    return {
        family: new PhoebeResource('/family').setInterface({customInterface: {method: 'post'}}),
        using: new PhoebeResource('/using'),
        car: new PhoebeResource('/car'),
        member: new PhoebeResource('/member')
    };
}]);