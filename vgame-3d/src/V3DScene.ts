import Animatable = BABYLON.Animatable;
class V3DScene extends BABYLON.Scene {
    public beginAnimation(target: any, from: number, to: number, loop?: boolean, speedRatio: number = 1.0, onAnimationEnd?: () => void, animatable?: Animatable): Animatable {

        //this.stopAnimation(target);

        if (!animatable) {
            animatable = new Animatable(this, target, from, to, loop, speedRatio, onAnimationEnd);
        }

        // Local animations
        if (target.animations) {
            animatable.appendAnimations(target, target.animations);
        }

        // Children animations
        if (target.getAnimatables) {
            var animatables = target.getAnimatables();
            for (var index = 0; index < animatables.length; index++) {
                this.beginAnimation(animatables[index], from, to, loop, speedRatio, onAnimationEnd, animatable);
            }
        }

        return animatable;
    }


}