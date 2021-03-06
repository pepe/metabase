/* @flow weak */

import React, { Component, PropTypes } from "react";

import TimeGroupingPopover
    from "metabase/query_builder/components/TimeGroupingPopover";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import { SelectButton } from "metabase/components/Select";

import * as Query from "metabase/lib/query/query";
import * as Card from "metabase/meta/Card";

import { parseFieldBucketing, formatBucketing } from "metabase/lib/query_time";

import type {
    Card as CardObject,
    DatasetQuery
} from "metabase/meta/types/Card";

type Props = {
    card: CardObject,
    setDatasetQuery: (datasetQuery: DatasetQuery) => void,
    runQueryFn: () => void
};

export default class TimeseriesGroupingWidget extends Component<*, Props, *> {
    _popover: ?any;

    render() {
        const { card, setDatasetQuery, runQueryFn } = this.props;
        if (Card.isStructured(card)) {
            const query = Card.getQuery(card);
            const breakouts = query && Query.getBreakouts(query);

            if (!breakouts || breakouts.length === 0) {
                return null;
            }

            return (
                <PopoverWithTrigger
                    triggerElement={
                        <SelectButton hasValue>
                            {formatBucketing(parseFieldBucketing(breakouts[0]))}
                        </SelectButton>
                    }
                    triggerClasses="my2"
                    ref={ref => this._popover = ref}
                >
                    <TimeGroupingPopover
                        className="text-brand"
                        field={breakouts[0]}
                        onFieldChange={breakout => {
                            let query = Card.getQuery(card);
                            if (query) {
                                query = Query.updateBreakout(
                                    query,
                                    0,
                                    breakout
                                );
                                // $FlowFixMe
                                setDatasetQuery({
                                    ...card.dataset_query,
                                    query
                                });
                                runQueryFn();
                                if (this._popover) {
                                    this._popover.close();
                                }
                            }
                        }}
                        title={null}
                        groupingOptions={[
                            "minute",
                            "hour",
                            "day",
                            "week",
                            "month",
                            "quarter",
                            "year"
                        ]}
                    />
                </PopoverWithTrigger>
            );
        } else {
            return null;
        }
    }
}
