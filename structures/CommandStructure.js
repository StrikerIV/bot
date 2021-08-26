/**
 * Class for structuring commands
 */
module.exports = class CommandStructure {
    constructor(props) {
        /**
         * @property {string} name The name of the command
         */
        this.name = props.name
        /**
         * @property {string} category The category that the command belongs to
         */
        this.category = props.category
        /**
         * @property {array} parameters The parameters passed from the CommandEvent
         */
        this.parameters = props.parameters
        /**
         * @property {array} [permissions] The permissions needed for the user and the client
         */
        this.permissions = props.permissions || []
        /**
         *  @property {array} [aliases] Possible aliases for the command
         */
        this.aliases = props.aliases || []
        /**
         * @property {array} [usageAreas] Types of channels the command can be run in
         */
        this.usageAreas = props.usageAreas || ["GUILD_TEXT", "GUILD_PUBLIC_THREAD"]
        /**
         * @property {number} [cooldown] The cooldown for the command
         */
        this.cooldown = props.cooldown || 5
        /**
         * @property {boolean} availableAsSlash Whether this command is available as a slash command
         */
        this.slash = props.slash || false
        /**
         * @property {function} execute The function to run the command
         */
        this.execute = props.execute
    }
}
