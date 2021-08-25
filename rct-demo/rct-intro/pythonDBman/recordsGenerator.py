import random
from random import randint as ri, choice, uniform
from connect import *


def gen_periods_records(N, yearsR=None, periodsSuffixR=None, beams=None, energyR=None):
    if yearsR is None:
        yearsR = (2021, 2025)
    if periodsSuffixR is None:
        periodsSuffixR = (1, 1000)
    if beams is None:
        beams = ['PbPb', 'Pbp', 'HeHe', 'pp', 'nn', 'ee', 'pn', 'en', 'ep', 'HePb']
    if energyR is None:
        energyR = (-2, 2)

    return [(
        'DEFAULT',
        ri(yearsR[0], yearsR[1]),
        'LHC' + str(ri(periodsSuffixR[0], periodsSuffixR[1])) + chr(ri(97, 111)),
        str(choice(beams)),
        str(round(uniform(energyR[0], energyR[1]), 3)) + ' TeV',
        'pass' + ''.join([str(ri(97, 111)) for _ in range(5)]),
        'link_Jira',
        'link_ML',
        'link_QC',
        'prod_' + ''.join([str(ri(97, 111)) for _ in range(5)])
    ) for _ in range(N)]


def gen_b_field(periodIds=None, bFieldR=None):
    if periodIds is None:
        conn = connect_cern_db()
        cur = conn.cursor()
        cur.execute('SELECT id from periods WHERE id not in(select period_id from "b_fields");')
        periodIds = cur.fetchall()
        periodIds = [e[0] for e in periodIds]
    if bFieldR is None:
        bFieldR = (-1, 1)

    pI = periodIds.copy()
    random.shuffle(pI)
    pI = pI[:int(len(pI) * 0.05)]
    l = len(pI)

    return [(
        'DEFAULT',
        str(periodIds.pop(ri(0, len(periodIds) - 1))),
        str(uniform(bFieldR[0], bFieldR[1])) + ' T'
    ) for _ in range(len(periodIds))] + \
           [(
               'DEFAULT',
               str(pI.pop(ri(0, len(pI) - 1))),
               str(uniform(bFieldR[0], bFieldR[1])) + ' T'
           ) for _ in range(l)]


def gen_runs(runsR=None, repeat=False):
    if runsR is None:
        runsR = (4, 20)
    conn = connect_cern_db()
    cur = conn.cursor()
    if not repeat:
        cur.execute('SELECT id from periods WHERE id not in(select period_id from runs);')
    else:
        cur.execute('SELECT id from periods;')
    periodIds = cur.fetchall()
    periodIds = [e[0] for e in periodIds]

    return [(
        'DEFAULT',
        str(pId),
        str(ri(1111111, 8888888)),
    ) for pId in periodIds for _ in range(ri(runsR[0], runsR[1]))]


def gen_monte_carlo(repeat=False):
    conn = connect_cern_db()
    cur = conn.cursor()
    if not repeat:
        cur.execute(
            'SELECT p.id from periods as p where p.id not in(SELECT period_id from "mc");')
    else:
        cur.execute('SELECT p.id from periods as p;')
    entries = cur.fetchall()

    return [(
        'DEFAULT',
        'mu_' + str(ri(100000, 100000000)),
        str(ri(1111111, 88888888)),
        'ir_' + str(ri(10000, 10000000)),
        'filing_scheme_' + str(ri(100000, 100000000)),
        str(pi[0])
    ) for pi in entries]


def gen_flags(flagsR=None, repeat=False):
    if flagsR is None:
        flagsR = (0, 10)
    conn = connect_cern_db()
    cur = conn.cursor()
    if not repeat:
        cur.execute(
            'SELECT id from runs where id not in(select run_id from flags);')
    else:
        cur.execute('SELECT id from runs')
    entries = cur.fetchall()
    entries = [e[0] for e in entries]

    return [(
        'DEFAULT',
        str(ri(10000, 1000000)),
        str(ri(1000000, 100000000)),
        "foo flag " + str(ri(100000, 1000000)),
        "some comment " + str(ri(1000000, 10000000)),
        str(rid)
    ) for rid in entries for _ in range(ri(flagsR[0], flagsR[1]))
    ]
