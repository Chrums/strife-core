import Component, { Constructor as ComponentConstructor } from '@core/Component';
import Entity from '@core/Entity';

export default class System<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> {
    
    public constructor(componentConstructor: ComponentConstructor<EntityType, ComponentType>) {
        
    }
    
}